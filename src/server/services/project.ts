import { Express } from "express";
import API from "common/api";
import {
  TypeCreateProjectPayload,
  TypeProjectDataDoc,
  TypeProjectData,
  TypeProjectInfo,
  TypeUiVersion
} from "types/project";
import { TypeResult, result } from "server/core/utils";
import {
  findProjectByUUID,
  getProjectListOf,
  createProject,
  updateProject
} from "server/db-handler/project";

export default function project(service: Express): void {
  // ---------------工程信息--------------- //
  // 添加工程
  service.post<never, TypeResult<TypeProjectDataDoc>, TypeCreateProjectPayload>(
    API.CREATE_PROJECT,
    async (req, res) => {
      try {
        const project = await createProject(req.body);
        res.send(result.success(project));
      } catch (err) {
        res.status(400).send(result.fail(err.message));
      }
    }
  );

  // 获取工程列表
  service.get<{ brandType: string }, any, TypeResult<TypeProjectDataDoc>>(
    `${API.GET_PROJECT_LIST}/:brandType`,
    (req, res) => {
      getProjectListOf(req.params.brandType)
        .then(project => res.send(result.success(project)))
        .catch(err => res.status(400).send(result.fail(err.message)));
    }
  );

  // 通过参数获取工程
  service.get<{ uuid: string }>(`${API.GET_PROJECT}/:uuid`, (req, res) => {
    findProjectByUUID(req.params.uuid)
      .then(project => res.send(result.success(project)))
      .catch(err => res.status(400).send(result.fail(err.message)));
  });

  // 更新数据
  service.post<
    { uuid: string },
    TypeResult<TypeProjectDataDoc>,
    Partial<TypeProjectData>
  >(`${API.UPDATE_PROJECT}/:uuid`, (req, res) => {
    updateProject(req.params.uuid, req.body)
      .then(project => res.send(result.success(project)))
      .catch(err => res.status(400).send(result.fail(err.message)));
  });

  // 更新工程描述信息
  service.post<
    { uuid: string },
    TypeResult<TypeProjectDataDoc>,
    TypeProjectInfo
  >(`${API.UPDATE_DESCRIPTION}/:uuid`, (req, res) => {
    updateProject(req.params.uuid, { description: req.body })
      .then(project => res.send(result.success(project)))
      .catch(err => res.status(400).send(result.fail(err.message)));
  });

  // 更新工程ui版本
  service.post<{ uuid: string }, TypeResult<TypeProjectDataDoc>, TypeUiVersion>(
    `${API.UPDATE_UI_VERSION}/:uuid`,
    (req, res) => {
      updateProject(req.params.uuid, { uiVersion: req.body })
        .then(project => res.send(result.success(project)))
        .catch(err => res.status(400).send(result.fail(err.message)));
    }
  );

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
}
