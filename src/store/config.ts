import ElectronStore from "electron-store";
import PathCollection from "src/data/PathCollection";
import defaultTheme from "src/common/theme/dark";
import { TypePathCollection } from "src/types/config.extra";
import { Point } from "electron";

type TypeStore = {
  pathConfig: TypePathCollection;
  colorRecently: string[];
  themeConfig: typeof defaultTheme;
  screenCenter: Partial<Point>;
};
const defaultState: TypeStore = {
  pathConfig: PathCollection.default,
  colorRecently: [],
  themeConfig: defaultTheme,
  screenCenter: {}
};

const electronStoreConfig = new ElectronStore<TypeStore>({ name: "config" });

// 若 key 不存在给个默认值
for (const key in defaultState) {
  if (!defaultState[key as keyof TypeStore]) {
    electronStoreConfig.set(key, defaultState[key as keyof TypeStore]);
  }
}

export default electronStoreConfig;
