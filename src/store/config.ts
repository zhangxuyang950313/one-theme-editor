import ElectronStore from "electron-store";
import PathCollection from "src/data/PathCollection";
import defaultTheme from "src/renderer/theme/dark";
import { TypePathCollection } from "src/types/extraConfig";
import { Point } from "electron";

type TypeStore = {
  serverPort: number;
  hostname: string;
  pathConfig: TypePathCollection;
  colorRecently: string[];
  themeConfig: typeof defaultTheme;
  screenCenter: Partial<Point>;
};
const defaultState: TypeStore = {
  serverPort: 0,
  hostname: "127.0.0.1:0",
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
