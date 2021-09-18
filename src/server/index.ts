import http from "http";
import logSymbols from "log-symbols";
import express from "express";
import { PORT, HOST } from "src/common/config";
import registerServiceController from "./controllers/index";
import registerSocket from "./sockets/index";

require("express-async-errors");

const service = express();

const server = http.createServer(service);

// 注册 http 服务
registerServiceController(service);

// 注册 socket 服务
registerSocket(server);

server.listen(PORT, function () {
  console.log(logSymbols.success, `服务启动 http://${HOST}:${PORT}`);
});
