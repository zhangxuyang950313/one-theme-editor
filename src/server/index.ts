import http from "http";
import express from "express";
import { PORT, HOST } from "common/config";
import registerService from "./service";
import registerSocket from "./socket";

const service = express();

const server = http.createServer(service);

// 注册 http 服务
registerService(service);

// 注册 socket 服务
registerSocket(server);

server.listen(PORT, function () {
  console.log("应用实例，访问地址为 http://%s:%s", HOST, PORT);
});
