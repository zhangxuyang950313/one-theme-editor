// 从数据库取出的项目文档数据
export type TypeDatabase<T = { [x: string]: any }> = T & {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// 图片路径
export type TypeImagePathLike = string;

export type TypeKeyValue = { key: string; value: string };

// 枚举对象 key
export type KeysEnum<T> = [...Array<keyof T>];
