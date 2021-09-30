import http from "http";
import express from "express";
import portfinder from "portfinder";
import logSymbols from "log-symbols";
import pathUtil from "server/utils/pathUtil";
import electronStore from "../common/electronStore";
import registerServiceController from "./controllers/index";
import registerSocket from "./sockets/index";

require("express-async-errors");

const service = express();

const server = http.createServer(service);

// 注册 http 服务
registerServiceController(service);

// 注册 socket 服务
registerSocket(server);

electronStore.set("pathConfig", {
  ...electronStore.get("pathConfig"),
  ...pathUtil
});

portfinder.getPortPromise().then(async port => {
  const hostname = `127.0.0.1:${port}`;
  electronStore.set("serverPort", port);
  electronStore.set("hostname", hostname);
  server.listen(port, () => {
    console.log(
      logSymbols.success,
      `服务启动 http://${hostname}`,
      `进程号 ${process.pid}`
    );
  });
});
