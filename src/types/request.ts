import { Canceler } from "axios";

// 文件的各种信息，用于可选传入，按执行效率优先级自行选取一个
export type TypeFileData = {
  url?: string;
  md5?: string;
  base64?: string;
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

// 写入 xml 模板参数
export type TypeWriteXmlTempPayload = {
  src: string;
  tag: string;
  attributes: [string, string][];
  value: string;
};

// // 获取模板中 name 的值
// export type TypeGetValueByNamePayload = {
//   name: string;
//   releaseXml: string;
// };

// 将一个元祖联合成对象的 key
export type UnionTupleToObjectKey<T extends string[], V = string> = {
  [k in T[number]]: V;
};
