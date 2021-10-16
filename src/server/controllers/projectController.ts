import path from "path";
import { Express } from "express";
import apiConfig from "src/constant/apiConf";
import {
  TypeCreateProjectPayload,
  TypeProjectDataDoc
} from "src/types/project";
import { TypeFileData } from "src/types/resource.page";
import { TypeResponseFrame, UnionTupleToObjectKey } from "src/types/request";
import {
  findProjectByQuery,
  getProjectListByMd5,
  createProject,
  updateProject
} from "server/dbHandler/project";
import { releaseXmlTemplate } from "server/services/xmlTemplate";
import {
  getPageResourceData,
  packProject,
  unpackProject
} from "server/services/project";
import { getFileData } from "src/common/utils/index";
import { checkParamsKey, result } from "server/utils/requestUtil";
import XmlCompilerExtra from "server/compiler/XmlCompilerExtra";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import ScenarioOptions from "server/compiler/ScenarioOptions";
import electronStore from "src/common/electronStore";

export default function projectController(service: Express): void {
  // 添加工程
  service.post<
    never,
    TypeResponseFrame<TypeProjectDataDoc, string>,
    TypeCreateProjectPayload // reqBody
  >(apiConfig.CREATE_PROJECT.path, async (request, response) => {
    const project = await createProject(request.body);
    response.send(result.success(project));
  });

  // 获取工程列表
  service.get<
    UnionTupleToObjectKey<typeof apiConfig.GET_PROJECT_LIST.params>, // reqParams
    TypeResponseFrame<TypeProjectDataDoc[], string>
  >(
    `${apiConfig.GET_PROJECT_LIST.path}/:scenarioMd5`,
    async (request, response) => {
      const project = await getProjectListByMd5(request.params.scenarioMd5);
      response.send(result.success(project));
    }
  );

  // 通过参数获取工程
  service.get<
    never,
    TypeResponseFrame<TypeProjectDataDoc>,
    never,
    Partial<TypeProjectDataDoc>
  >(apiConfig.GET_PROJECT_DATA.path, async (request, response) => {
    const project = await findProjectByQuery(request.query);
    response.send(result.success(project));
  });

  // 更新数据
  service.post<
    UnionTupleToObjectKey<typeof apiConfig.UPDATE_PROJECT.params>, // reqParams
    TypeResponseFrame<TypeProjectDataDoc, string>, // resBody
    typeof apiConfig.UPDATE_PROJECT.body // reqBody
  >(apiConfig.UPDATE_PROJECT.path, async (request, response) => {
    const project = await updateProject(request.params.uuid, request.body);
    response.send(result.success(project));
  });

  // 更新工程描述信息
  service.post<
    never,
    TypeResponseFrame<TypeProjectDataDoc, string>, // resBody
    typeof apiConfig.UPDATE_PROJECT_INFO.body, // reqBody
    UnionTupleToObjectKey<typeof apiConfig.UPDATE_PROJECT_INFO.query> // reqQuery
  >(apiConfig.UPDATE_PROJECT_INFO.path, async (request, response) => {
    const { uuid } = request.query;
    const projectInfo = request.body;
    console.log("更新工程描述信息", { uuid, projectInfo });
    const project = await updateProject(uuid, { projectInfo });
    response.send(result.success(project));
  });

  // 更新工程ui版本
  service.post<
    UnionTupleToObjectKey<typeof apiConfig.UPDATE_UI_VERSION.params>,
    TypeResponseFrame<TypeProjectDataDoc, string>,
    typeof apiConfig.UPDATE_UI_VERSION.body
  >(`${apiConfig.UPDATE_UI_VERSION.path}/:uuid`, async (request, response) => {
    const { uuid } = request.params;
    const uiVersion = request.body;
    const project = await updateProject(uuid, { uiVersion });
    response.send(result.success(project));
  });

  // // 删除一个工程
  // app.delete("/project", (req, res) => {
  //   db.projects
  //     .remove(req.body, { multi: true })
  //     .then(result => {
  //       res.send(send.success(result));
  //     })
  //     .catch(err => {
  //       res.send(send.fail(err));
  //     });
  // });

  // // 删除所有工程
  // app.delete("/project/all", (req, res) => {
  //   db.projects
  //     .remove({}, { multi: true })
  //     .then(result => {
  //       res.send(send.success(result));
  //     })
  //     .catch(err => {
  //       res.send(send.fail(err));
  //     });
  // });

  /**
   * 查询 xml 模板 name 对应的值
   */
  service.get<
    never,
    TypeResponseFrame<{ value: string }, string>,
    never,
    UnionTupleToObjectKey<typeof apiConfig.GET_XML_TEMP_VALUE.query>
  >(apiConfig.GET_XML_TEMP_VALUE.path, async (request, response) => {
    const { query } = request;
    checkParamsKey(query, apiConfig.GET_XML_TEMP_VALUE.query);
    const { uuid, name, src } = query;
    const project = await findProjectByQuery({ uuid });
    const releaseFile = path.join(project.root, src);
    const xmlElement = new XmlFileCompiler(releaseFile).getElement();
    const value = new XmlCompilerExtra(xmlElement).getValueByName(name);
    response.send(result.success({ value }));
  });

  /**
   * 将 key 的 value 写入 xml ${placeholder}
   */
  service.post<
    UnionTupleToObjectKey<typeof apiConfig.XML_TEMPLATE_WRITE.query>, // reqParams
    TypeResponseFrame<Record<string, string>>, // resBody
    typeof apiConfig.XML_TEMPLATE_WRITE.body, // reqBody
    never // reqQuery
  >(apiConfig.XML_TEMPLATE_WRITE.path, async (request, response) => {
    const { body } = request;
    checkParamsKey(body, apiConfig.XML_TEMPLATE_WRITE.bodyKeys);
    const data = await releaseXmlTemplate(body);
    response.send(result.success(data));
  });

  /**
   * @deprecated
   * 获取配置页面所有素材数据映射
   */
  service.get<
    never,
    TypeResponseFrame<Record<string, TypeFileData>>,
    never, // reqBody
    UnionTupleToObjectKey<typeof apiConfig.GET_PAGE_RESOURCE.query>
  >(`${apiConfig.GET_PAGE_RESOURCE.path}`, async (request, response) => {
    const { query } = request;
    checkParamsKey(query, apiConfig.GET_PAGE_RESOURCE.query);
    const data = await getPageResourceData(query.uuid, query.config);
    response.send(result.success(data));
  });

  /**
   * 获取文件数据
   */
  service.get<
    never,
    TypeResponseFrame<TypeFileData>,
    never,
    UnionTupleToObjectKey<typeof apiConfig.GET_PROJECT_FILE_DATA.query>
  >(`${apiConfig.GET_PROJECT_FILE_DATA.path}`, async (request, response) => {
    const { query } = request;
    checkParamsKey(query, apiConfig.GET_PROJECT_FILE_DATA.query);
    const { filepath } = query;
    const root = electronStore.get("projectPath");
    const fileData = getFileData(path.join(root, filepath));
    response.send(result.success(fileData));
  });

  /**
   * 打包工程
   */
  service.post<
    never, // reqParams
    TypeResponseFrame<string[]>, // resBody
    typeof apiConfig.PACK_PROJECT.body, // reqBody
    UnionTupleToObjectKey<typeof apiConfig.PACK_PROJECT.query> // reqQuery
  >(apiConfig.PACK_PROJECT.path, async (request, response) => {
    checkParamsKey(request.query, apiConfig.PACK_PROJECT.query);
    const { scenarioMd5, packDir, outputFile } = request.query;
    const packConfig = ScenarioOptions.def.getPackConfigByMd5(scenarioMd5);
    if (!packConfig) {
      response.send(result.fail("未配置打包规则"));
      return;
    }
    const files = await packProject({
      packDir,
      packConfig,
      outputFile: outputFile
    });
    response.send(result.success(files));
  });

  service.post<
    never, // reqParams
    TypeResponseFrame<string[]>, // resBody
    never, // reqBody
    UnionTupleToObjectKey<typeof apiConfig.UNPACK_PROJECT.query> // reqQuery
  >(apiConfig.UNPACK_PROJECT.path, async (request, response) => {
    checkParamsKey(request.query, apiConfig.UNPACK_PROJECT.query);
    const { scenarioMd5, unpackFile, outputDir } = request.query;
    const packConfig = ScenarioOptions.def.getPackConfigByMd5(scenarioMd5);
    if (!packConfig) {
      response.send(result.fail("未配置打包规则"));
      return;
    }
    const files = await unpackProject({ unpackFile, packConfig, outputDir });
    response.send(result.success(files));
  });
}
