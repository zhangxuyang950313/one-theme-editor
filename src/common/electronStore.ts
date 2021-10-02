import ElectronStore from "electron-store";
import PathCollection from "src/data/PathCollection";
import { TypePathConfig } from "src/types/extraConfig";

type TypeElectronStore = {
  serverPort: number;
  hostname: string;
  pathConfig: TypePathConfig;
};
const defaultState: TypeElectronStore = {
  serverPort: 0,
  hostname: "127.0.0.1:0",
  pathConfig: PathCollection.default
};

const electronStore = new ElectronStore<TypeElectronStore>();

// 若 key 不存在给个默认值
for (const key in defaultState) {
  if (!defaultState[key as keyof TypeElectronStore]) {
    electronStore.set(key, defaultState[key as keyof TypeElectronStore]);
  }
}

export default electronStore;
