// 文件的各种信息，用于可选传入，按执行效率优先级自行选取一个
export type TypeFileData = {
  url?: string;
  md5?: string;
  base64?: string;
};

// response 模板
export type TypeResponseFrame<T = null> = {
  msg: "success" | "fail";
  data: T;
};
