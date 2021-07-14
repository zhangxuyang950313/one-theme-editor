export type TypeDataProps<T extends Record<string, T[keyof T]>> = {
  data: T;
};

// export interface TypeDataModel<T> {
//   createData(): T;
// }

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
