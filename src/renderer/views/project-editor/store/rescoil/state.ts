import { atom } from "recoil";
import ProjectData from "src/data/ProjectData";
import ResourceConfig, { ModuleConfig, PageConfig } from "src/data/ResourceConfig";
import ScenarioConfig from "src/data/ScenarioConfig";

import keys from "./keys";

// 面板显示隐藏控制
export const panelToggleState = atom({
  key: keys.panelToggle,
  default: {
    moduleSelector: true,
    pageSelector: true,
    pagePreview: true
  }
});

// 工程数据
export const projectDataState = atom({
  key: keys.projectData,
  default: {
    projectData: ProjectData.default,
    resourceConfig: ResourceConfig.default,
    scenarioConfig: ScenarioConfig.default
  }
});

// 选中状态管理
export const selectDataState = atom({
  key: keys.selectData,
  default: {
    focusKeyPath: "",
    moduleSelected: ModuleConfig.default,
    pageSelected: PageConfig.default
  }
});

// 打包进度管理
export const packProgressState = atom({
  key: keys.progress,
  default: {
    progress: -1,
    message: ""
  }
});
