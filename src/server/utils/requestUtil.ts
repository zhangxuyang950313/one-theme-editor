import { TypeResultSuccess, TypeResultFail } from "src/types/request";

export const result: {
  success: <T>(data: T) => TypeResultSuccess<T>;
  fail: <T>(data: T) => TypeResultFail<T>;
} = {
  success: data => ({ msg: "success", data: data }),
  fail: err => ({ msg: "error", data: err })
};

// 检查参数的 key
export const checkParamsKey = <T>(obj: T, keys: readonly string[]): void => {
  const objKeySet = new Set(Object.keys(obj));
  keys.forEach(key => {
    if (!objKeySet.has(key)) {
      throw new Error(`缺少参数"${key}"`);
    }
  });
};
