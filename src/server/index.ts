import express from "express";
import bodyParser from "body-parser";
import Nedb from "nedb-promises";
import { PROJECTS_FILE } from "../common/paths";
import { getTempConfList } from "../common/Template";

const HOST = "127.0.0.1";
const PORT = 9999;

console.log({ PROJECTS_FILE });

function createNedb(filename: string) {
  return new Nedb({
    filename,
    autoload: true,
    timestampData: true
  });
}

const db: Record<string, Nedb> = {
  projects: createNedb(PROJECTS_FILE)
};

const send = {
  success: (data: any) => {
    return { msg: "success", data };
  },
  fail: (err: any) => {
    return { msg: "error", info: err };
  }
};

const app = express();
const rawParser = bodyParser.json();
app.use(rawParser);

// 模板解析
app.get<any, any, any, { brandType: string }>("/template/list", (req, res) => {
  getTempConfList(req.query.brandType)
    .then(result => {
      res.send(send.success(result));
    })
    .catch(err => {
      res.send(send.fail(err));
    });
});

// ------------------------------ //

// 工程信息
// 添加工程
app.post("/project/add", (req, res) => {
  db.projects
    .insert(req.body)
    .then(result => {
      res.send(send.success(result));
    })
    .catch(err => {
      res.send(send.fail(err));
    });
});

// 通过参数获取工程
app.get("/project/find", (req, res) => {
  db.projects
    .findOne(req.query)
    .then(result => {
      res.send(send.success(result));
    })
    .catch(err => {
      res.send(send.fail(err));
    });
});

// 获取所有工程
app.get("/project/all", (req, res) => {
  db.projects
    .find({})
    .then(result => {
      res.send(send.success(result));
    })
    .catch(err => {
      res.send(send.fail(err));
    });
});

// 更新数据
app.post("/project/update", (req, res) => {
  db.projects
    .update({ _id: req.body._id }, req.body)
    .then(result => {
      res.send(send.success(result));
    })
    .catch(err => {
      res.send(send.fail(err));
    });
});

// 通过 query 删除一个工程
app.delete("/project", (req, res) => {
  db.projects
    .remove(req.body, { multi: true })
    .then(result => {
      res.send(send.success(result));
    })
    .catch(err => {
      res.send(send.fail(err));
    });
});

// 删除所有工程
app.delete("/project/all", (req, res) => {
  db.projects
    .remove({}, { multi: true })
    .then(result => {
      res.send(send.success(result));
    })
    .catch(err => {
      res.send(send.fail(err));
    });
});

app.listen(PORT, function () {
  console.log("应用实例，访问地址为 http://%s:%s", HOST, PORT);
});
