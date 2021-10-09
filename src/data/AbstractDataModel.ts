/**
 * 数据模板抽象类
 * ```typescript
 * class MyDataModel extends AbstractDataModel<{ a: number, b: number}> {
 *  // 默认值
 *  protected data = {  a: 0, b: 0  }
 * }
 * // how to use
 * new MyDataModel()
 *  .set("a", 1)    // ok
 *  .set("a", "a")  // error
 *  .set("b", 2)    // ok
 *  .set("c", 3)    // error
 *  .create()
 * ```
 */
export abstract class AbstractDataModel<T extends Record<string, unknown>> {
  protected abstract data: T;
  has<K extends keyof T>(k: K): boolean {
    return k in this.data;
  }
  get<K extends keyof T>(k: K): T[K] {
    return this.data[k];
  }
  set<K extends keyof T>(k: K, value: T[K]): this {
    if (this.has(k) && value !== undefined) {
      this.data[k] = value;
    }
    return this;
  }
  // 批量设定当前数据结构已有的属性
  setBatch(data: T): this {
    for (const key in data) {
      this.set(key, data[key]);
    }
    return this;
  }
  // 批量设定当前数据结构中键的对象数据结构
  setBatchOf<K extends keyof T>(k: K, value: T[K]): this {
    if (this.has(k)) {
      for (const key in this.data[k]) {
        this.data[k][key] = value[key];
      }
    }
    return this;
  }
  // 构建数据结构，可选传入数据，这是最后设置数据的机会
  // instance.create(data) <=> instance.setBatch(data) && instance.create()
  create(data?: T): T {
    if (data) {
      this.setBatch(data);
    }
    return this.data;
  }
}
