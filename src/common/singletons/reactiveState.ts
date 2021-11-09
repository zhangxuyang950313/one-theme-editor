// import path from "path";
import ResourceConfig from "src/data/ResourceConfig";
import ProjectData from "src/data/ProjectData";
import ScenarioConfig from "src/data/ScenarioConfig";
import ProcessReactiveState from "src/common/classes/ProcessReactiveState";
// import ResourceConfigCompiler from "src/common/classes/ResourceConfigCompiler";
// import pathUtil from "src/common/utils/pathUtil";

const reactiveState = new ProcessReactiveState({
  projectData: ProjectData.default,
  resourceConfig: ResourceConfig.default,
  scenarioConfig: ScenarioConfig.default,
  projectPath: "",
  resourcePath: ""
});

// reactiveState.addSetterHook((obj, prop, value) => {
//   if (prop === "projectData") {
//     const { projectData } = obj;
//     if (projectData.root) {
//       reactiveState.set("projectPath", projectData.root);
//     }
//     if (projectData.resourceSrc) {
//       reactiveState.set(
//         "resourceConfig",
//         ResourceConfigCompiler.from(projectData.resourceSrc).getConfig()
//       );
//     }
//     if (obj.resourceConfig.namespace) {
//       reactiveState.set(
//         "resourcePath",
//         path.join(pathUtil.RESOURCE_CONFIG_DIR, obj.resourceConfig.namespace)
//       );
//     }
//   }
// });

export default reactiveState;
