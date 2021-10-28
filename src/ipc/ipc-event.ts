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
  $getFileData = "$getFileData"
}

export default IPC_EVENT;
