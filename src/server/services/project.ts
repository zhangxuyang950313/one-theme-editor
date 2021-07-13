import path from "path";
import { Express } from "express";
import API from "common/api";
import { TypeCreateProjectPayload, TypeProjectDataDoc } from "types/project";
import { TypeResponseFrame, UnionArrayValueToObjectKey } from "types/request";
import { result } from "server/utils/utils";
import {
  findProjectByUUID,
  getProjectListOf,
  createProject,
  updateProject
} from "server/db-handler/project";
import { releaseXmlTemplate } from "server/file-handler/xml-template";
import XmlTemplate from "server/compiler/XmlTemplate";
import { checkParamsKey } from "./../utils/utils";

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
    UnionArrayValueToObjectKey<typeof API.GET_PROJECT_LIST.params>, // reqParams
    TypeResponseFrame<TypeProjectDataDoc[], string>
  >(`${API.GET_PROJECT_LIST.url}/:brandType`, async (request, response) => {
    checkParamsKey(request.params, API.GET_PROJECT_LIST.params);
    const project = await getProjectListOf(request.params.brandType);
    response.send(result.success(project));
  });

  // 通过参数获取工程
  service.get<UnionArrayValueToObjectKey<typeof API.GET_PROJECT.params>>(
    `${API.GET_PROJECT.url}/:uuid`,
    async (request, response) => {
      checkParamsKey(request.params, API.GET_PROJECT.params);
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
    UnionArrayValueToObjectKey<typeof API.UPDATE_PROJECT_INFO.params>,
    TypeResponseFrame<TypeProjectDataDoc, string>,
    typeof API.UPDATE_PROJECT_INFO.body
  >(`${API.UPDATE_PROJECT_INFO.url}/:uuid`, async (request, response) => {
    const { uuid } = request.params;
    const description = request.body;
    const project = await updateProject(uuid, { description });
    response.send(result.success(project));
  });

  // 更新工程ui版本
  service.post<
    UnionArrayValueToObjectKey<typeof API.UPDATE_UI_VERSION.params>,
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
    UnionArrayValueToObjectKey<typeof API.GET_XML_TEMP_VALUE.query>
  >(API.GET_XML_TEMP_VALUE.url, async (request, response) => {
    checkParamsKey(request.query, API.GET_XML_TEMP_VALUE.query);
    const { name, releaseXml } = request.query;
    const { projectPathname } = request.cookies;
    const releaseFile = path.join(projectPathname, releaseXml);
    const value = new XmlTemplate(releaseFile).getValueByName(name);
    response.send(result.success({ value }));
  });

  /**
   * 将 key 的 value 写入 xml ${placeholder}
   */
  service.post<
    never, // reqParams
    TypeResponseFrame<typeof API.XML_TEMPLATE_RELEASE.requestBody, string>, // resBody
    typeof API.XML_TEMPLATE_RELEASE.requestBody // reqBody
  >(API.XML_TEMPLATE_RELEASE.url, async (request, response) => {
    releaseXmlTemplate(request.body);
    response.send(result.success(request.body));
  });
}
