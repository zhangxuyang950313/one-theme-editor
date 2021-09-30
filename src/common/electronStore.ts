import Store from "electron-store";

const store = new Store();
export const initStore = (): void => {
  store.set("source", 10005);
};
export const getStoreInstance = (): Store<Record<string, unknown>> => {
  return store;
};
export const clearStore = (): void => {
  if (store) {
    store.clear();
  }
};
export const setStore = <T>(key: string, mes: T): void => {
  if (store) {
    store.set(key, mes);
  }
};
export const getStore = (key: string): unknown => {
  if (store) {
    return store.get(key);
  } else {
    return null;
  }
};
