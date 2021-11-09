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

const electronStoreConfig = new ElectronStore<TypeStore>({
  name: "config",
  defaults: defaultState
});

export default electronStoreConfig;
