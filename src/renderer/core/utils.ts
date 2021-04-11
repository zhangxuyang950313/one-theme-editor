// 随机字符串，最多11位
export function getRandomStr(
  len: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 = 11
): string {
  return Math.random().toString(36).slice(2, len);
}

// 数组为空
export function arrayIsEmpty(data: unknown): boolean {
  return !!(Array.isArray(data) && data.length);
}

// pick Object with def
export function pickObjectWithDef<T, U extends keyof T, D>(
  object: T,
  props: Array<U>,
  def: D
): { [k in U]: T[U] | D } {
  return props.reduce((t, o) => {
    t[o] = o in object ? object[o] : def;
    return t;
  }, {} as { [k in U]: T[U] | D });
}

// 异步 map
export async function asyncMap<T = any>(
  list: T[],
  callbackfn: (value: T, index: number, array: T[]) => T
): Promise<T[]> {
  return await Promise.all(list.map(async (...args) => callbackfn(...args)));
}
