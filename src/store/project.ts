import ElectronStore from "electron-store";
import ProjectData from "src/data/ProjectData";
import { TypeProjectData } from "src/types/project";
import { TypeResourceConfig } from "src/types/config.resource";
import { TypeScenarioConfig } from "src/types/config.scenario";
import ScenarioConfig from "src/data/ScenarioConfig";
import ResourceConfigData from "src/data/ResourceConfig";

type TypeProjectDataStore = {
  projectData: TypeProjectData;
  scenarioConfig: TypeScenarioConfig;
  resourceConfig: TypeResourceConfig;
  resourcePath: string;
  projectPath: string;
};
const defaultState: TypeProjectDataStore = {
  projectData: ProjectData.default,
  scenarioConfig: ScenarioConfig.default,
  resourceConfig: ResourceConfigData.default,
  resourcePath: "",
  projectPath: ""
};

const electronStoreProject = new ElectronStore<TypeProjectDataStore>({
  name: "project-data",
  defaults: defaultState
});

electronStoreProject.reset();

// // 若 key 不存在给个默认值
// for (const key in defaultState) {
//   if (!defaultState[key as keyof TypeProjectDataStore]) {
//     store.set(key, defaultState[key as keyof TypeProjectDataStore]);
//   }
// }

export default electronStoreProject;
