import path from "path";
import { Express } from "express";
import API from "common/apiConf";
import {
  TypeCreateProjectPayload,
  TypeProjectDataDoc,
  TypeProjectFileData
} from "types/project";
import { TypeResponseFrame, UnionTupleToObjectKey } from "types/request";
import { result } from "server/utils/utils";
import {
  findProjectByUUID,
  getProjectListOf,
  createProject,
  updateProject
} from "server/db-handler/project";
import { releaseXmlTemplate } from "server/services/xmlTemplate";
import {
  getPageDefineSourceData,
  getProjectFileData
} from "server/services/project";
import XmlTemplate from "server/compiler/XmlTemplate";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import { checkParamsKey } from "../utils/utils";

export default function project(service: Express): void {
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
  >(`${API.GET_PROJECT_LIST.url}/:brandType`, async (request, response) => {
    const project = await getProjectListOf(request.params.brandType);
    response.send(result.success(project));
  });

  // 通过参数获取工程
  service.get<UnionTupleToObjectKey<typeof API.GET_PROJECT.params>>(
    `${API.GET_PROJECT.url}/:uuid`,
    async (request, response) => {
      const project = await findProjectByUUID(request.params.uuid);
      response.send(result.success(project));
    }
  );

  // 更新数据
  service.post<
    { uuid: string }, // reqParams
    TypeResponseFrame<TypeProjectDataDoc, string>, // resBody
    typeof API.UPDATE_PROJECT.body // reqBody
  >(`${API.UPDATE_PROJECT.url}/:uuid`, async (request, response) => {
    const project = await updateProject(request.params.uuid, request.body);
    response.send(result.success(project));
  });

  // 更新工程描述信息
  service.post<
    UnionTupleToObjectKey<typeof API.UPDATE_PROJECT_INFO.params>,
    TypeResponseFrame<TypeProjectDataDoc, string>,
    typeof API.UPDATE_PROJECT_INFO.body
  >(API.UPDATE_PROJECT_INFO.url, async (request, response) => {
    const { uuid } = request.params;
    const description = request.body;
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
    const project = await findProjectByUUID(uuid);
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
    UnionTupleToObjectKey<typeof API.GET_PAGE_SOURCE_DATA.params>,
    TypeResponseFrame<Record<string, TypeProjectFileData>>,
    never, // reqBody
    UnionTupleToObjectKey<typeof API.GET_PAGE_SOURCE_DATA.query>
  >(`${API.GET_PAGE_SOURCE_DATA.url}/:uuid`, async (request, response) => {
    const { params, query } = request;
    checkParamsKey(params, API.GET_PAGE_SOURCE_DATA.params);
    checkParamsKey(query, API.GET_PAGE_SOURCE_DATA.query);
    const data = await getPageDefineSourceData(params.uuid, query.config);
    response.send(result.success(data));
  });

  /**
   * 获取文件数据
   */
  service.get<
    UnionTupleToObjectKey<typeof API.GET_SOURCE_FILE_DATA.params>,
    TypeResponseFrame<TypeProjectFileData>,
    never,
    UnionTupleToObjectKey<typeof API.GET_SOURCE_FILE_DATA.query>
  >(`${API.GET_SOURCE_FILE_DATA.url}/:uuid`, async (request, response) => {
    const { params, query } = request;
    checkParamsKey(params, API.GET_SOURCE_FILE_DATA.params);
    checkParamsKey(query, API.GET_SOURCE_FILE_DATA.query);
    const { projectRoot } = await findProjectByUUID(params.uuid);
    const data = getProjectFileData(projectRoot, query.filepath);
    response.send(result.success(data));
  });
}
