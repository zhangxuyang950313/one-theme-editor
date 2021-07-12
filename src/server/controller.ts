import { result } from "server/utils/utils";
import express, { ErrorRequestHandler, Express, RequestHandler } from "express";
import cookieParser from "cookie-parser";
import imageService from "./services/image";
import sourceService from "./services/source";
import projectService from "./services/project";
import utilsService from "./services/utils";

const HeaderHandler: RequestHandler = (req, res, next) => {
  //判断路径
  if (req.path !== "/" && !req.path.includes(".")) {
    res.set({
      "Access-Control-Allow-Credentials": true, //允许后端发送cookie
      "Access-Control-Allow-Origin": req.headers.origin || "*", //任意域名都可以访问,或者基于我请求头里面的域
      "Access-Control-Allow-Headers": "X-Requested-With,Content-Type", //设置请求头格式和类型
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", //允许支持的请求方式
      "Content-Type": "application/json; charset=utf-8" //默认与允许的文本格式json和编码格式
    });
  }
  req.method === "OPTIONS" ? res.status(204).end() : next();
};

// 同步错误拦截器
const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(400).send(result.fail(err.message));
  // TODO：写日志
};

// 注册服务
export default function registerService(service: Express): void {
  service.use(express.json());
  service.use(cookieParser());
  service.use(express.urlencoded({ extended: false }));
  service.use(HeaderHandler);
  // 图片服务
  imageService(service);

  // 资源服务
  sourceService(service);

  // 工程服务
  projectService(service);

  // 工具服务
  utilsService(service);

  // 异步拦截器，一定要放在最后
  service.use(ErrorHandler);
}
