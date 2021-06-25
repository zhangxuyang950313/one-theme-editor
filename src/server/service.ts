import path from "path";
import fse from "fs-extra";
import express, { Express } from "express";
import FileType from "file-type";
import API from "common/api";
import { base64ToLocalFile } from "common/utils";
import { TypeUiVersion } from "types/source-config";
import { TypeCreateProjectData, TypeProjectDescription } from "types/project";
import { TypeFileData } from "types/request";
import ERR_CODE from "renderer/core/error-code";
import {
  compileSourceDescriptionList,
  readBrandConf
} from "./compiler/source-config";
import {
  findProjectByUUID,
  getProjectListOf,
  createProject,
  updateProject
} from "./db-handler/project";
import { findImageData } from "./db-handler/image";

const result = {
  success: (data?: any) => {
    return { msg: "success", data: data || null };
  },
  fail: (err: any) => {
    return { msg: "error", data: err };
  }
};

export default function registerService(service: Express): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  service.use(express.json());
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  service.use(express.urlencoded({ extended: false }));
  service.use((req, res, next) => {
    //判断路径
    if (req.path !== "/" && !req.path.includes(".")) {
      res.set({
        "Access-Control-Allow-Credentials": true, //允许后端发送cookie
        "Access-Control-Allow-Origin": req.headers.origin || "*", //任意域名都可以访问,或者基于我请求头里面的域
        "Access-Control-Allow-Headers": "X-Requested-With,Content-Type", //设置请求头格式和类型
        "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS", //允许支持的请求方式
        "Content-Type": "application/json; charset=utf-8" //默认与允许的文本格式json和编码格式
      });
    }
    req.method === "OPTIONS" ? res.status(204).end() : next();
  });

  // // 通过工程 _id 和图片 key 获取图片数据
  // app.get<any, any, any, { projectId: string; imageId: string }>(
  //   "/image",
  //   (req, res) => {
  //     findProjectById(req.query.projectId).then(project => {
  //       const imageData = project?.resource.find(
  //         item => item.id === req.query.imageId
  //       );
  //       res.send(send.success(imageData || null));
  //     });
  //   }
  // );

  /**
   * 图片服务
   * @params file 图片本地路径
   */
  service.get<any, any, any, { file: string }>("/image", async (req, res) => {
    try {
      const { file } = req.query;
      if (!fse.existsSync(file)) {
        throw new Error(ERR_CODE[4003]);
      }
      const buff = fse.readFileSync(file);
      const fileType = await FileType.fromBuffer(buff);
      if (!fileType) {
        throw new Error(ERR_CODE[4003]);
      }
      res.set({ "Content-Type": fileType.mime });
      res.send(buff);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

  // 获取厂商配置列表
  service.get(API.GET_BRAND_LIST, async (req, res) => {
    try {
      const brandConfList = await readBrandConf();
      res.send(result.success(brandConfList));
    } catch (err) {
      res.status(400).send(result.fail(err.message));
    }
  });

  // 获取配置预览列表
  service.get<{ brandType: string }>(
    `${API.GET_SOURCE_DESCRIPTION_LIST}/:brandType`,
    async (req, res) => {
      try {
        const { brandType } = req.params;
        const configPreview = await compileSourceDescriptionList(brandType);
        res.send(result.success(configPreview));
      } catch (err) {
        res.status(400).send(result.fail(err.message));
      }
    }
  );
  // 获取配置列表
  service.get<{ brandType: string }>(
    `${API.GET_SOURCE_CONFIG_LIST}/:brandType`,
    async (req, res) => {
      try {
        const configPreview = await compileSourceDescriptionList(
          req.params.brandType
        );
        res.send(result.success(configPreview));
      } catch (err) {
        res.status(400).send(result.fail(err.message));
      }
    }
  );

  // ---------------工程信息--------------- //
  // 添加工程
  service.post<any, any, TypeCreateProjectData, any>(
    API.CREATE_PROJECT,
    (req, res) => {
      console.log(req.body);
      createProject(req.body)
        .then(project => res.send(result.success(project)))
        .catch(err => res.status(400).send(result.fail(err)));
    }
  );

  // 获取工程列表
  service.get<{ brandType: string }>(
    `${API.GET_PROJECT_LIST}/:brandType`,
    (req, res) => {
      getProjectListOf(req.params.brandType)
        .then(project => res.send(result.success(project)))
        .catch(err => res.status(400).send(result.fail(err)));
    }
  );

  // 通过参数获取工程
  service.get<{ uuid: string }>(`${API.GET_PROJECT}/:uuid`, (req, res) => {
    findProjectByUUID(req.params.uuid)
      .then(project => res.send(result.success(project)))
      .catch(err => res.status(400).send(result.fail(err)));
  });

  // 更新数据
  service.post<{ uuid: string }>(`${API.UPDATE_PROJECT}/:uuid`, (req, res) => {
    updateProject(req.params.uuid, req.body)
      .then(project => res.send(result.success(project)))
      .catch(err => res.status(400).send(result.fail(err)));
  });

  // 更新工程描述信息
  service.post<{ uuid: string }, any, TypeProjectDescription>(
    `${API.UPDATE_DESCRIPTION}/:uuid`,
    (req, res) => {
      updateProject(req.params.uuid, { description: req.body })
        .then(project => res.send(result.success(project)))
        .catch(err => res.status(400).send(result.fail(err)));
    }
  );

  // 更新工程ui版本
  service.post<{ uuid: string }, any, TypeUiVersion>(
    `${API.UPDATE_UI_VERSION}/:uuid`,
    (req, res) => {
      updateProject(req.params.uuid, { uiVersion: req.body })
        .then(project => res.send(result.success(project)))
        .catch(err => res.status(400).send(result.fail(err)));
    }
  );

  // // 增加一个程图片映射列表
  // service.post<{ uuid: string }, any, TypeImageMapper>(
  //   `${API.ADD_IMAGE_MAPPER}/:uuid`,
  //   (req, res) => {
  //     updateProject(req.params.uuid, { $push: { imageMapperList: req.body } })
  //       .then(project => res.send(result.success(project)))
  //       .catch(err => res.status(400).send(result.fail(err)));
  //   }
  // );

  // // 删除一个工程图片映射列表
  // service.post<{ uuid: string }, any, TypeImageMapper>(
  //   `${API.DEL_IMAGE_MAPPER}/:uuid`,
  //   (req, res) => {
  //     updateProject(req.params.uuid, { $pull: { imageMapperList: req.body } })
  //       .then(project => res.send(result.success(project)))
  //       .catch(err => res.status(400).send(result.fail(err)));
  //   }
  // );

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

  // // 写入本地文件
  // service.post<any, any, { fileData: TypeFileData; to: string }>(
  //   API.WRITE_FILE,
  //   async (req, res) => {
  //     try {
  //       const { fileData, to } = req.body;
  //       const { url, base64 } = fileData;
  //       let md5 = fileData.md5;
  //       // base64 直接写入
  //       if (base64) {
  //         await base64ToLocalFile(to, base64).then(rw => rw && rw());
  //       }

  //       // md5 去查数据库获得 base64 再写入
  //       if (!md5 && url) md5 = path.basename(url);
  //       if (!md5) throw new Error("md5 为空");

  //       const imageData = await findImageData(md5);
  //       if (imageData.base64) {
  //         await base64ToLocalFile(to, imageData.base64).then(rw => rw && rw());
  //         return res.send(result.success());
  //       } else throw new Error(`图片数据库获取${md5}失败`);
  //     } catch (err) {
  //       // console.error(err);
  //       res.status(400).send(result.fail(`${ERR_CODE[4002]}, ${err}`));
  //     }
  //   }
  // );

  // 复制本地文件
  service.post<any, any, { from: string; to: string }>(
    API.COPY_FILE,
    (req, res) => {
      const { from, to } = req.body;
      if (!fse.existsSync(from)) {
        return res.status(400).send(result.fail(ERR_CODE[4003]));
      }
      fse.copyFileSync(from, to);
      return res.send(result.success());
    }
  );
  // 删除本地文件
  service.post<any, any, { file: string }>(API.DELETE_FILE, (req, res) => {
    const { file } = req.body;
    if (!fse.existsSync(file)) {
      return res.status(400).send(result.fail(ERR_CODE[4003]));
    }
    fse
      .remove(file)
      .then(() => res.send(result.success()))
      .catch(err => res.status(400).send(result.fail(err)));
  });
}
