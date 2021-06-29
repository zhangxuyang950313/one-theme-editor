import fse from "fs-extra";
import FileType from "file-type";
import express, { Express } from "express";
import API from "common/api";
import ERR_CODE from "renderer/core/error-code";
import * as PATHS from "@/core/path-config";
import {
  TypeCreateProjectPayload,
  TypeProjectDataDoc,
  TypeProjectData,
  TypeProjectInfo,
  TypeUiVersion
} from "types/project";
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

type TypeResultSuccess<T> = {
  msg: "success";
  data: T | null;
};
type TypeResultFail<T = null> = {
  msg: "error";
  data: T | null;
};
type TypeResult<T = null> = TypeResultSuccess<T> | TypeResultFail<string>;

const result: {
  success: <T>(data?: T) => TypeResultSuccess<T>;
  fail: <T>(data?: T) => TypeResultFail<T>;
} = {
  success: data => ({ msg: "success", data: data || null }),
  fail: err => ({ msg: "error", data: err || null })
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
  service.get<{ file: string }, Buffer, never>(
    `${API.IMAGE}:file`,
    async (req, res) => {
      try {
        const file = req.params.file;
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
        res.send(err.message);
      }
    }
  );

  // 获取路径配置
  service.get(API.GET_PATH_CONFIG, async (req, res) => {
    try {
      res.send(result.success(PATHS));
    } catch (err) {
      res.status(400).send(result.fail(err.message));
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
        const sourceDescription = await compileSourceDescriptionList(brandType);
        res.send(result.success(sourceDescription));
      } catch (err) {
        res.status(400).send(result.fail(err.message));
      }
    }
  );

  // // 获取配置列表
  // service.get<{ brandType: string }>(
  //   `${API.GET_SOURCE_CONFIG_LIST}/:brandType`,
  //   async (req, res) => {
  //     try {
  //       const configPreview = await compileSourceDescriptionList(
  //         req.params.brandType
  //       );
  //       res.send(result.success(configPreview));
  //     } catch (err) {
  //       res.status(400).send(result.fail(err.message));
  //     }
  //   }
  // );

  // ---------------工程信息--------------- //
  // 添加工程
  service.post<
    any,
    any,
    TypeResult<TypeProjectDataDoc>,
    TypeCreateProjectPayload
  >(API.CREATE_PROJECT, async (req, res) => {
    try {
      const project = await createProject(req.body);
      res.send(result.success(project));
    } catch (err) {
      res.status(400).send(result.fail(err.message));
    }
  });

  // 获取工程列表
  service.get<{ brandType: string }, any, TypeResult<TypeProjectDataDoc>>(
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
  service.post<
    { uuid: string },
    TypeResult<TypeProjectDataDoc>,
    Partial<TypeProjectData>
  >(`${API.UPDATE_PROJECT}/:uuid`, (req, res) => {
    updateProject(req.params.uuid, req.body)
      .then(project => res.send(result.success(project)))
      .catch(err => res.status(400).send(result.fail(err)));
  });

  // 更新工程描述信息
  service.post<
    { uuid: string },
    TypeResult<TypeProjectDataDoc>,
    TypeProjectInfo
  >(`${API.UPDATE_DESCRIPTION}/:uuid`, (req, res) => {
    updateProject(req.params.uuid, { description: req.body })
      .then(project => res.send(result.success(project)))
      .catch(err => res.status(400).send(result.fail(err)));
  });

  // 更新工程ui版本
  service.post<{ uuid: string }, TypeResult<TypeProjectDataDoc>, TypeUiVersion>(
    `${API.UPDATE_UI_VERSION}/:uuid`,
    (req, res) => {
      updateProject(req.params.uuid, { uiVersion: req.body })
        .then(project => res.send(result.success(project)))
        .catch(err => res.status(400).send(result.fail(err)));
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
  service.post<
    never, // reqParams
    TypeResult<null>, // resBody
    { from: string; to: string } // reqBody
  >(API.COPY_FILE, (req, res) => {
    try {
      const { from, to } = req.body;
      if (!fse.existsSync(from)) {
        res.status(400).send(result.fail(ERR_CODE[4003]));
        return;
      }
      fse.copySync(from, to);
      // fse.createReadStream(from).pipe(fse.createWriteStream(to)).destroy();
      res.send(result.success(null));
    } catch (err) {
      console.log(err);
      res.status(400).send(result.fail(err.message));
    }
  });
  // 删除本地文件
  service.post<never, TypeResult<null>, { file: string }>(
    API.DELETE_FILE,
    (req, res) => {
      try {
        const { file } = req.body;
        if (!fse.existsSync(file)) {
          res.status(400).send(result.fail(ERR_CODE[4003]));
          return;
        }
        fse.unlinkSync(file);
        res.send(result.success(null));
      } catch (err) {
        res.status(400).send(result.fail(err.message));
      }
    }
  );
}
