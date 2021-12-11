enum IPC_EVENT {
  $getPID = "$getPid",

  // 响应数据变化
  $reactiveSet = "$reactiveSet",

  // 配置
  $getScenarioOptionList = "$getScenarioOptionList",
  $getResourceConfigList = "$getResourceConfigList",
  $getScenarioOption = "$getScenarioOption",
  $getScenarioConfig = "$getScenarioConfig",
  $getResourceConfig = "$getResourceConfig",
  $getPageConfig = "$getPageConfig",

  // 工程
  $createProject = "$createProject",
  $updateProject = "$updateProject",
  $projectCreated = "$projectCreated",
  $getProjectList = "$getProjectList",
  $getProject = "$getProject",
  $updateProjectInfo = "$updateProjectInfo",
  $compact9patch = "$compact9patch",
  $compact9patchBatch = "$compact9patchBatch",
  $applyProject = "$applyProject",
  $packProject = "$packProject",
  $exportProject = "$exportProject",
  $unpackProject = "$unpackProject",
  $patchPreview = "$patchPreview",

  $getDeviceList = "$getDeviceList",

  // 窗口管理
  $openProjectEditor = "$openProjectEditor",
  $openProjectManager = "$openProjectManager",

  // 监听文件
  $startWatchDir = "$watchDirFiles",
  $fileChange = "$fileChange",
  $getWatchedMapper = "$getWatchedMapper",
  $closeWatcher = "$closeWatcher",
  $closeAllWatcher = "$closeAllWatcher",

  // 文件操作
  $copyFile = "$copyFile",
  $deleteFile = "$deleteFile",
  $writeXmlTemplate = "$writeXmlTemplate",
  $getFileData = "$getFileData",
  $getFileDataSync = "$getFileDataSync",

  // shell
  $shell = "$shell"
}

export default IPC_EVENT;
