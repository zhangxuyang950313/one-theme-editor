import { TypeResultSuccess, TypeResultFail } from "types/request";

export const result: {
  success: <T>(data?: T) => TypeResultSuccess<T>;
  fail: <T>(data?: T) => TypeResultFail<T>;
} = {
  success: data => ({ msg: "success", data: data || null }),
  fail: err => ({ msg: "error", data: err || null })
};
