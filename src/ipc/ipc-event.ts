enum IPC_EVENT {
  $getPID = "$getPid",

  $reactiveStateSet = "$reactiveStateSet",

  // 配置
  $getScenarioOptionList = "$getScenarioOptionList",
  $getResourceOptionList = "$getResourceOptionList",
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
  $apply = "$apply",

  // 窗口管理
  $openCreateProjectWindow = "$openCreateProjectWindow",
  $openProjectEditorWindow = "$openProjectEditorWindow",
  $openStarter = "$openStarter",

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
