enum IPC_EVENT {
  $getPID = "$getPid",
  $getScenarioOptionList = "$getScenarioOptionList",
  $getResourceOptionList = "$getResourceOptionList",
  $getScenarioConfig = "$getScenarioOption",
  $getResourceConfig = "$getResourceConfig",
  $getPageConfig = "$getPageConfig",

  $createProject = "$createProject",
  $getProjectList = "$getProjectList",
  $getProject = "$getProject",
  $updateProjectInfo = "$updateProjectInfo",

  $openProjectEditor = "$openProjectEditor",
  $openStarter = "$openStarter"
}

export default IPC_EVENT;
