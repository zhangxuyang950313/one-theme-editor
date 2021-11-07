enum IPC_EVENT {
  $getPID = "$getPid",

  $reactiveStateSet = "$reactiveStateSet",

  // 配置
  $getScenarioOptionList = "$getScenarioOptionList",
  $getResourceConfigList = "$getResourceConfigList",
  $getScenarioOption = "$getScenarioOption",
  $getScenarioConfig = "$getScenarioConfig",
  $getResourceConfig = "$getResourceConfig",
  $getPageConfig = "$getPageConfig",

  // 工程
  $createProject = "$createProject",
  $projectCreated = "$projectCreated",
  $getProjectList = "$getProjectList",
  $getProject = "$getProject",
  $updateProjectInfo = "$updateProjectInfo",
  $applyProject = "$applyProject",
  $packProject = "$packProject",
  $unpackProject = "$unpackProject",

  // 窗口管理
  $openProjectEditor = "$openProjectEditor",
  $openProjectManager = "$openProjectManager",

  // 监听文件
  $startWatchDir = "$watchDirFiles",
  $fileChange = "$fileChange",
  $getWatcherWatched = "$getWatcherWatched",
  $closeWatcher = "$closeWatcher",
  $closeAllWatcher = "$closeAllWatcher",

  // 文件操作
  $copyFile = "$copyFile",
  $deleteFile = "$deleteFile",
  $writeXmlTemplate = "$writeXmlTemplate",
  $getFileData = "$getFileData",
  $getFileDataSync = "$getFileDataSync"
}

export default IPC_EVENT;
