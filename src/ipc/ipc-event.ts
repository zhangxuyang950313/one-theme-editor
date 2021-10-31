enum IPC_EVENT {
  $getPID = "$getPid",
  $getScenarioOptionList = "$getScenarioOptionList",
  $getResourceOptionList = "$getResourceOptionList",
  $getScenarioOption = "$getScenarioOption",
  $getScenarioConfig = "$getScenarioConfig",
  $getResourceConfig = "$getResourceConfig",
  $getPageConfig = "$getPageConfig",

  $createProject = "$createProject",
  $projectCreated = "$projectCreated",
  $getProjectList = "$getProjectList",
  $getProject = "$getProject",
  $updateProjectInfo = "$updateProjectInfo",

  $openCreateProjectWindow = "$openCreateProjectWindow",
  $openProjectEditor = "$openProjectEditor",
  $openStarter = "$openStarter",

  $startWatchDir = "$watchDirFiles",
  $fileChange = "$fileChange",
  $getWatcherWatched = "$getWatcherWatched",
  $closeWatcher = "$closeWatcher",
  $closeAllWatcher = "$closeAllWatcher",

  $reactiveStateSet = "$reactiveStateSet",

  $copyFile = "$copyFile",
  $deleteFile = "$deleteFile",
  $writeXmlTemplate = "$writeXmlTemplate",
  $getFileData = "$getFileData",
  $getFileDataSync = "$getFileDataSync"
}

export default IPC_EVENT;
