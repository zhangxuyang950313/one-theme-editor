// 此工具的作用是将 T 类型中的 K 键列表提取出来，生成新的子键值对类型。
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 此工具的作用是将 K 中所有属性值转化为 T 类型，我们常用它来申明一个普通 object 对象。
export type Record<K extends keyof any, T> = {
  [key in K]: T;
};

// 此工具的作用就是将泛型中全部属性变为可选的。
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 此工具是在 T 类型中，去除 T 类型和 U 类型的交集，返回剩余的部分。
export type Exclude<T, U> = T extends U ? never : T;

// 此工具可认为是适用于键值对对象的 Exclude，它会去除类型 T 中包含 K 的键值对。
// Omit 与 Pick 得到的结果完全相反，一个是取非结果，一个取交结果
export type Omit = Pick<T, Exclude<keyof T, K>>;

// 此工具就是获取 T 类型(函数)对应的返回值类型：
export type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

export type ReturnTypeEqual<T extends func> = T extends () => infer R ? R : any;

// 此工具可以将类型 T 中所有的属性变为必选项。
export type Required<T> = {
  [P in keyof T]-?: T[P];
};
