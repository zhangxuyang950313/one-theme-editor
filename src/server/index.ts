import express from "express";
import bodyParser from "body-parser";
import { getTempConfList } from "common/Template";
import { PORT, HOST } from "common/config";
import { getProjectList, initProject } from "./project-handler";

const send = {
  success: (data: any) => {
    return { msg: "success", data };
  },
  fail: (err: any) => {
    return { msg: "error", data: err };
  }
};

const app = express();
const rawParser = bodyParser.json();
app.use(rawParser);

app.use((req, res, next) => {
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

// 模板列表
app.get<any, any, any, { brandType: string }>("/template/list", (req, res) => {
  getTempConfList(req.query.brandType)
    .then(templateList => {
      res.send(send.success(templateList));
    })
    .catch(err => {
      res.send(send.fail(err));
    });
});

// ---------------工程信息--------------- //
// 添加工程
app.post("/project/add", (req, res) => {
  initProject(req.body)
    .then(result => {
      res.send(send.success(result));
    })
    .catch(err => {
      res.send(send.fail(err));
    });
});

// 获取工程列表
app.get("/project/all", (req, res) => {
  getProjectList()
    .then(result => {
      res.send(send.success(result));
    })
    .catch(err => {
      res.send(send.fail(err));
    });
});

// // 通过参数获取工程
// app.get("/project/find", (req, res) => {
//   db.projects
//     .findOne(req.query)
//     .then(result => {
//       res.send(send.success(result));
//     })
//     .catch(err => {
//       res.send(send.fail(err));
//     });
// });

// // 更新数据
// app.post("/project/update", (req, res) => {
//   db.projects
//     .update({ _id: req.body._id }, req.body)
//     .then(result => {
//       res.send(send.success(result));
//     })
//     .catch(err => {
//       res.send(send.fail(err));
//     });
// });

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

app.listen(PORT, function () {
  console.log("应用实例，访问地址为 http://%s:%s", HOST, PORT);
});
