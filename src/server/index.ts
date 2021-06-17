import express from "express";
import bodyParser from "body-parser";
import FileType from "file-type";
import { PORT, HOST } from "common/config";
import API from "common/api";
import {
  TypeCreateProjectData,
  TypeProjectDescription,
  TypeUiVersionInfo,
  TypeImageMapper
} from "types/project";
import {
  findProjectByUUID,
  getProjectListOf,
  createProject,
  updateProject
} from "./db-handler/project";
import { getTemplates, compileBrandConf } from "./db-handler/template";
import { findImageData } from "./db-handler/image";

const result = {
  success: (data: any) => {
    return { msg: "success", data: data || null };
  },
  fail: (err: any) => {
    return { msg: "error", data: err };
  }
};

const service = express();
const rawParser = bodyParser.json();
service.use(rawParser);

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

service.get<{ md5: string }, any, any, any>("/image/:md5", (req, res) => {
  findImageData(req.params.md5).then(async data => {
    const buffer = Buffer.from(
      data.base64?.replace(/^data:image\/\w+;base64,/, "") || "",
      "base64"
    );
    const fileType = await FileType.fromBuffer(buffer);
    if (fileType) {
      res.set({ "Content-Type": fileType.mime });
      res.send(buffer);
    } else {
      res.status(400);
    }
  });
});

// 获取厂商列表
service.get(API.GET_BRAND_LIST, (req, res) => {
  compileBrandConf()
    .then(brandConfList => res.send(result.success(brandConfList)))
    .catch(err => res.status(400).send(result.fail(err)));
});

// 模板列表
service.get<{ brandType: string }>(
  `${API.GET_TEMPLATE_LIST}/:brandType`,
  (req, res) => {
    getTemplates(req.params.brandType)
      .then(templateConfList => res.send(result.success(templateConfList)))
      .catch(err => res.status(400).send(result.fail(err)));
  }
);

// ---------------工程信息--------------- //
// 添加工程
service.post<any, any, TypeCreateProjectData, any>(
  API.CREATE_PROJECT,
  (req, res) => {
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
service.post<{ uuid: string }, any, TypeUiVersionInfo>(
  `${API.UPDATE_UI_VERSION}/:uuid`,
  (req, res) => {
    updateProject(req.params.uuid, { uiVersion: req.body })
      .then(project => res.send(result.success(project)))
      .catch(err => res.status(400).send(result.fail(err)));
  }
);

// 增加一个程图片映射列表
service.post<{ uuid: string }, any, TypeImageMapper>(
  `${API.ADD_IMAGE_MAPPER}/:uuid`,
  (req, res) => {
    updateProject(req.params.uuid, { $push: { imageMapperList: req.body } })
      .then(project => res.send(result.success(project)))
      .catch(err => res.status(400).send(result.fail(err)));
  }
);

// 删除一个工程图片映射列表
service.post<{ uuid: string }, any, TypeImageMapper>(
  `${API.DEL_IMAGE_MAPPER}/:uuid`,
  (req, res) => {
    updateProject(req.params.uuid, { $pull: { imageMapperList: req.body } })
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

service.listen(PORT, function () {
  console.log("应用实例，访问地址为 http://%s:%s", HOST, PORT);
});
