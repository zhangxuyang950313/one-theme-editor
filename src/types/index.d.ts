// 从数据库取出的项目文档数据
export type TypeDatabase<T = { [x: string]: any }> = T & {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// 图片路径
export type TypeImagePathLike = string;

// 路径配置
export type TypePathConfig = typeof import("server/core/path-config");
