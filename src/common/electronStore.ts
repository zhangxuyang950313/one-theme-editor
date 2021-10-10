import path from "path";
import ElectronStore from "electron-store";
import PathCollection from "src/data/PathCollection";
import ProjectData from "src/data/ProjectData";
import { TypePathConfig } from "src/types/extraConfig";
import { TypeProjectData } from "src/types/project";
import {
  TypeResourceConfig,
  TypeScenarioConfig
} from "src/types/resource.config";
import { ScenarioOption } from "src/data/ScenarioConfig";
import ResourceConfigData from "src/data/ResourceConfig";

type TypeElectronStore = {
  serverPort: number;
  hostname: string;
  pathConfig: TypePathConfig;
  projectData: TypeProjectData;
  scenarioConfig: TypeScenarioConfig;
  resourceConfig: TypeResourceConfig;
  resourcePath: string;
  projectPath: string;
};
const defaultState: TypeElectronStore = {
  serverPort: 0,
  hostname: "127.0.0.1:0",
  pathConfig: PathCollection.default,
  projectData: ProjectData.default,
  scenarioConfig: ScenarioOption.default,
  resourceConfig: ResourceConfigData.default,
  resourcePath: "",
  projectPath: ""
};

const electronStore = new ElectronStore<TypeElectronStore>();

// 若 key 不存在给个默认值
for (const key in defaultState) {
  if (!defaultState[key as keyof TypeElectronStore]) {
    electronStore.set(key, defaultState[key as keyof TypeElectronStore]);
  }
}

export default electronStore;
