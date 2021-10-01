import logSymbols from "log-symbols";
import { result } from "server/utils/requestUtil";
import express, { ErrorRequestHandler, Express, RequestHandler } from "express";
import cookieParser from "cookie-parser";
import imageController from "./imageController";
import resourceController from "./resourceController";
import projectController from "./projectController";
import fileController from "./fileController";
import extraController from "./extraController";

const HeaderHandler: RequestHandler = (req, res, next) => {
  //判断路径
  if (req.path !== "/" && !req.path.includes(".")) {
    res.set({
      "Access-Control-Allow-Credentials": true, //允许后端发送cookie
      "Access-Control-Allow-Origin": req.headers.origin || "*", //任意域名都可以访问,或者基于我请求头里面的域
      "Access-Control-Allow-Headers": "X-Requested-With,Content-Type", //设置请求头格式和类型
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", //允许支持的请求方式
      "Content-Type": "application/json; charset=utf-8", //默认与允许的文本格式json和编码格式
      "Cache-Control": "max-age=0", // 不使用强缓存而使用协商缓存，主要是根据本地文件最后的修改时间来确定
      "Expires": "0"
    });
  }
  req.method === "OPTIONS" ? res.status(204).end() : next();
};

// 同步错误拦截器
const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(400).send(result.fail(err.message));
  // TODO：写日志
  console.debug(logSymbols.error, "error: ↓↓↓↓↓↓\n", err);
};

// 注册服务
export default function registerServiceController(service: Express): void {
  service.use(express.json());
  service.use(cookieParser());
  service.use(express.urlencoded({ extended: false }));
  service.use(HeaderHandler);
  // 图片服务
  imageController(service);

  // 资源服务
  resourceController(service);

  // 工程服务
  projectController(service);

  // 文件服务
  fileController(service);

  // 扩展服务
  extraController(service);

  // 包含异步拦截器，一定要放在最后
  service.use(ErrorHandler);
}
