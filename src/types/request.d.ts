import { Canceler } from "axios";

// 文件的各种信息，用于可选传入，按执行效率优先级自行选取一个
export type TypeFileData = {
  url?: string;
  md5?: string;
  base64?: string;
};

// requestResult
export type TypeRequestResult<T> = {
  msg: "success";
  data: T;
};

// response 模板
export type TypeResultSuccess<T> = {
  msg: "success";
  data: T;
};
export type TypeResultFail<T> = {
  msg: "error";
  data: T;
};
export type TypeResponseFrame<S, F = string> =
  | TypeResultSuccess<S>
  | TypeResultFail<F>;

export type TypeGetCanceler = (c: Canceler) => void;

// 释放 xml 模板请求载荷
export type TypeReleaseXmlTempPayload = {
  key: string;
  value: string;
  template: string;
  release: string;
};

// // 获取模板中 name 的值
// export type TypeGetValueByNamePayload = {
//   name: string;
//   releaseXml: string;
// };

// 将一个数组 value 作为成对象的 key
export type UnionArrayValueToObjectKey<T extends Array, V = string> = {
  [k in T[number]]: V;
};
