import path from "path";
import { Express } from "express";
import API from "common/api";
import {
  TypeCreateProjectPayload,
  TypeProjectDataDoc,
  TypeProjectData,
  TypeProjectInfo,
  TypeUiVersion
} from "types/project";
import {
  TypeGetValueByNamePayload,
  TypeReleaseXmlTempPayload,
  TypeResponseFrame
} from "types/request";
import { result } from "server/utils/utils";
import {
  findProjectByUUID,
  getProjectListOf,
  createProject,
  updateProject
} from "server/db-handler/project";
import { releaseXmlTemplate } from "server/file-handler/xml-template";
import XmlTemplate from "server/compiler/XmlTemplate";

export default function project(service: Express): void {
  // 添加工程
  service.post<
    never,
    TypeResponseFrame<TypeProjectDataDoc, string>,
    TypeCreateProjectPayload
  >(API.CREATE_PROJECT, async (request, response) => {
    const project = await createProject(request.body);
    response.send(result.success(project));
  });

  // 获取工程列表
  service.get<
    { brandType: string },
    TypeResponseFrame<TypeProjectDataDoc[], string>
  >(`${API.GET_PROJECT_LIST}/:brandType`, (request, response) => {
    getProjectListOf(request.params.brandType).then(project =>
      response.send(result.success(project))
    );
  });

  // 通过参数获取工程
  service.get<{ uuid: string }>(
    `${API.GET_PROJECT}/:uuid`,
    async (request, response) => {
      const project = await findProjectByUUID(request.params.uuid);
      response.send(result.success(project));
    }
  );

  // 更新数据
  service.post<
    { uuid: string }, // reqParams
    TypeResponseFrame<TypeProjectDataDoc, string>, // resBody
    Partial<TypeProjectData> // reqBody
  >(`${API.UPDATE_PROJECT}/:uuid`, async (request, response) => {
    const project = await updateProject(request.params.uuid, request.body);
    response.send(result.success(project));
  });

  // 更新工程描述信息
  service.post<
    { uuid: string },
    TypeResponseFrame<TypeProjectDataDoc, string>,
    TypeProjectInfo
  >(`${API.UPDATE_DESCRIPTION}/:uuid`, async (request, response) => {
    const { uuid } = request.params;
    const description = request.body;
    const project = await updateProject(uuid, { description });
    response.send(result.success(project));
  });

  // 更新工程ui版本
  service.post<
    { uuid: string },
    TypeResponseFrame<TypeProjectDataDoc, string>,
    TypeUiVersion
  >(`${API.UPDATE_UI_VERSION}/:uuid`, async (request, response) => {
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
   * 获取项目中 xml 模板 name 对应的值
   */
  service.get<
    never,
    TypeResponseFrame<{ value: string }, string>,
    never,
    TypeGetValueByNamePayload
  >(API.GET_XML_TEMP_VALUE, async (request, response) => {
    const { name, template } = request.query;
    if (!name) throw new Error("缺少 name 参数");
    if (!template) throw new Error("缺少 template 参数");
    const { projectPathname } = request.cookies;
    const tempFile = path.join(projectPathname, template);
    const value = new XmlTemplate(tempFile).getValueByName(name);
    response.send(result.success({ value }));
  });

  /**
   * 将 key 的 value 写入 xml ${placeholder}
   */
  service.post<
    never, // reqParams
    TypeResponseFrame<TypeReleaseXmlTempPayload, string>, // resBody
    TypeReleaseXmlTempPayload // reqBody
  >(API.XML_TEMPLATE_RELEASE, async (request, response) => {
    releaseXmlTemplate(request.body);
    response.send(result.success(request.body));
  });
}
