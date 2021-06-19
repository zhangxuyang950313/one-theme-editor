// 从数据库取出的项目文档数据
export type TypeDatabase<T = { [x: string]: any }> = T & {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
};
