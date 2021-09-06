import path from "path";
import pathUtil from "server/utils/pathUtil";
import { Express } from "express";
import API from "src/common/apiConf";
import {
  TypeCreateProjectPayload,
  TypeProjectDataDoc,
  TypeProjectFileData
} from "src/types/project";
import { TypeResponseFrame, UnionTupleToObjectKey } from "src/types/request";
import {
  findProjectByQuery,
  getProjectListByBrandMd5,
  createProject,
  updateProject
} from "server/db-handler/project";
import { releaseXmlTemplate } from "server/services/xmlTemplate";
import {
  getPageDefineSourceData,
  getProjectFileData,
  packProject
} from "server/services/project";
import { checkParamsKey, result } from "server/utils/requestUtil";
import { unzipProject } from "server/utils/unpackUtil";
import XmlTemplate from "server/compiler/XmlTemplate";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import BrandOptions from "server/compiler/BrandOptions";

export default function projectController(service: Express): void {
  // 添加工程
  service.post<
    never,
    TypeResponseFrame<TypeProjectDataDoc, string>,
    TypeCreateProjectPayload // reqBody
  >(API.CREATE_PROJECT.url, async (request, response) => {
    const project = await createProject(request.body);
    response.send(result.success(project));
  });

  // 获取工程列表
  service.get<
    UnionTupleToObjectKey<typeof API.GET_PROJECT_LIST.params>, // reqParams
    TypeResponseFrame<TypeProjectDataDoc[], string>
  >(`${API.GET_PROJECT_LIST.url}/:brandMd5`, async (request, response) => {
    const project = await getProjectListByBrandMd5(request.params.brandMd5);
    response.send(result.success(project));
  });

  // 通过参数获取工程
  service.get<
    never,
    TypeResponseFrame<TypeProjectDataDoc>,
    never,
    Partial<TypeProjectDataDoc>
  >(API.GET_PROJECT_DATA.url, async (request, response) => {
    const project = await findProjectByQuery(request.query);
    response.send(result.success(project));
  });

  // 更新数据
  service.post<
    UnionTupleToObjectKey<typeof API.UPDATE_PROJECT.params>, // reqParams
    TypeResponseFrame<TypeProjectDataDoc, string>, // resBody
    typeof API.UPDATE_PROJECT.body // reqBody
  >(API.UPDATE_PROJECT.url, async (request, response) => {
    const project = await updateProject(request.params.uuid, request.body);
    response.send(result.success(project));
  });

  // 更新工程描述信息
  service.post<
    never,
    TypeResponseFrame<TypeProjectDataDoc, string>, // resBody
    typeof API.UPDATE_PROJECT_INFO.body, // reqBody
    UnionTupleToObjectKey<typeof API.UPDATE_PROJECT_INFO.query> // reqQuery
  >(API.UPDATE_PROJECT_INFO.url, async (request, response) => {
    const { uuid } = request.query;
    const description = request.body;
    console.log("更新工程描述信息", { uuid, description });
    const project = await updateProject(uuid, { description });
    response.send(result.success(project));
  });

  // 更新工程ui版本
  service.post<
    UnionTupleToObjectKey<typeof API.UPDATE_UI_VERSION.params>,
    TypeResponseFrame<TypeProjectDataDoc, string>,
    typeof API.UPDATE_UI_VERSION.body
  >(`${API.UPDATE_UI_VERSION.url}/:uuid`, async (request, response) => {
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
    UnionTupleToObjectKey<typeof API.GET_XML_TEMP_VALUE.query>
  >(API.GET_XML_TEMP_VALUE.url, async (request, response) => {
    const { query } = request;
    checkParamsKey(query, API.GET_XML_TEMP_VALUE.query);
    const { uuid, name, src } = query;
    const project = await findProjectByQuery({ uuid });
    const releaseFile = path.join(project.projectRoot, src);
    const xmlElement = new XmlFileCompiler(releaseFile).getElement();
    const value = new XmlTemplate(xmlElement).getValueByName(name);
    response.send(result.success({ value }));
  });

  /**
   * 将 key 的 value 写入 xml ${placeholder}
   */
  service.post<
    never, // reqParams
    TypeResponseFrame<Record<string, string>>, // resBody
    typeof API.XML_TEMPLATE_WRITE.body, // reqBody
    UnionTupleToObjectKey<typeof API.XML_TEMPLATE_WRITE.query> // reqQuery
  >(API.XML_TEMPLATE_WRITE.url, async (request, response) => {
    const { body, query } = request;
    checkParamsKey(query, API.XML_TEMPLATE_WRITE.query);
    checkParamsKey(body, API.XML_TEMPLATE_WRITE.bodyKeys);
    const data = await releaseXmlTemplate(query.uuid, body);
    response.send(result.success(data));
  });

  /**
   * @deprecated
   * 获取配置页面所有素材数据映射
   */
  service.get<
    never,
    TypeResponseFrame<Record<string, TypeProjectFileData>>,
    never, // reqBody
    UnionTupleToObjectKey<typeof API.GET_PAGE_SOURCE_DATA.query>
  >(`${API.GET_PAGE_SOURCE_DATA.url}`, async (request, response) => {
    const { query } = request;
    checkParamsKey(query, API.GET_PAGE_SOURCE_DATA.query);
    const data = await getPageDefineSourceData(query.uuid, query.config);
    response.send(result.success(data));
  });

  /**
   * 获取文件数据
   */
  service.get<
    never,
    TypeResponseFrame<TypeProjectFileData>,
    never,
    UnionTupleToObjectKey<typeof API.GET_SOURCE_FILE_DATA.query>
  >(`${API.GET_SOURCE_FILE_DATA.url}`, async (request, response) => {
    const { query } = request;
    checkParamsKey(query, API.GET_SOURCE_FILE_DATA.query);
    const { projectRoot } = await findProjectByQuery({ uuid: query.uuid });
    const data = getProjectFileData(projectRoot, query.filepath);
    response.send(result.success(data));
  });

  /**
   * 打包工程
   */
  service.post<
    never, // reqParams
    TypeResponseFrame<string[]>, // resBody
    typeof API.PACK_PROJECT.body, // reqBody
    UnionTupleToObjectKey<typeof API.PACK_PROJECT.query> // reqQuery
  >(API.PACK_PROJECT.url, async (request, response) => {
    checkParamsKey(request.query, API.PACK_PROJECT.query);
    const { outputFile, uuid } = request.query;
    const { brandConfig, projectRoot } = await findProjectByQuery({ uuid });
    const packConfig = BrandOptions.from(
      pathUtil.SOURCE_CONFIG_FILE
    ).getPackageConfigByBrandMd5(brandConfig.md5);
    if (!packConfig) {
      response.send(result.fail("未配置打包规则"));
      return;
    }
    const files = await packProject({ projectRoot, packConfig, outputFile });
    response.send(result.success(files));
  });

  service.post(API.UNPACK_PROJECT.url, async (request, response) => {
    response.send(
      await unzipProject(
        "/Users/zhangxuyang/Desktop/素白App（超级锁屏+简约不简单+返现）.mtz.zip"
      )
    );
  });
}
