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
export abstract class AbstractDataModel<T> {
  protected abstract data: T;
  protected defaultVal = { ...this.create() };
  get<K extends keyof T>(k: K): T[K] {
    return this.data[k];
  }
  set<K extends keyof T>(k: K, value: T[K]): this {
    this.data[k] = value;
    return this;
  }
  default(): T {
    return this.defaultVal;
  }
  create(): T {
    return this.data;
  }
}
