import { atom } from "recoil";
import ProjectData from "src/data/ProjectData";
import ResourceConfig, {
  ModuleConfig,
  PageConfig
} from "src/data/ResourceConfig";
import ScenarioConfig from "src/data/ScenarioConfig";

// 面板显示隐藏控制
export const panelToggleState = atom({
  key: "panelToggle",
  default: {
    moduleSelector: true,
    pageSelector: true,
    pagePreview: true
  }
});

// 工程数据
export const projectDataState = atom({
  key: "projectData",
  default: {
    projectData: ProjectData.default,
    resourceConfig: ResourceConfig.default,
    scenarioConfig: ScenarioConfig.default
  }
});

// 选中状态管理
export const selectDataState = atom({
  key: "selectData",
  default: {
    moduleSelected: ModuleConfig.default,
    pageSelected: PageConfig.default
  }
});
