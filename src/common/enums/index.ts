// 设置页面标题
export enum PRESET_TITLE {
  default = "一个主题编辑器",
  welcome = "欢迎使用一个主题编辑器"
}

// 加载状态
export enum LOAD_STATUS {
  INITIAL, // 初始
  LOADING, // 加载中
  SUCCESS, // 成功
  FAILED, // 失败
  TIMEOUT, // 超时
  UNKNOWN // 未知
}

export enum ELEMENT_TAG {
  Image = "Image",
  Text = "Text",
  // 打包配置
  PackageConfig = "PackageConfig",
  Item = "Item",
  // 应用配置
  ApplyConfig = "ApplyConfig",
  Step = "Step",
  Exclude = "Exclude",
  // 资源配置
  Module = "Module",
  Page = "Page",
  Group = "Group",
  Resource = "Resource",
  Preview = "Preview",
  UiVersion = "UiVersion",
  Layout = "Layout",
  Templates = "Templates",
  Template = "Template",
  Value = "Value",
  Color = "Color",
  Scenario = "Scenario",
  ResourceConfig = "ResourceConfig",
  FileTemplate = "FileTemplate",
  Items = "Items",
  Xml = "Xml"
}

// xml元素类型
export enum ELEMENT_TYPE {
  IMAGE = "image",
  TEXT = "text"
}

// 文件类型
export enum FILE_TYPE {
  UNKNOWN = "unknown",
  IMAGE = "image",
  XML = "xml"
}

// 资源协议
export enum RESOURCE_PROTOCOL {
  FILE = "file", // 单纯的文件
  SRC = "src", // 资源和工程共用的
  RESOURCE = "resource", // 相对资源路径
  PROJECT = "project", // 相对工程路径
  RELATIVE = "relative" // 相对当前配置路径
}

// 资源类型标签
export enum RESOURCE_TAG {
  File = "File",
  Color = "Color",
  String = "String",
  Number = "Number",
  Boolean = "Boolean"
}

export enum LAYOUT_ELEMENT_TAG {
  Layout = "Layout",
  Image = "Image",
  Text = "Text"
}

export enum ALIGN_VALUE {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right"
}

export enum ALIGN_V_VALUE {
  TOP = "top",
  CENTER = "center",
  BOTTOM = "bottom"
}

// 颜色格式
export enum HEX_FORMAT {
  RGBA = "RGBA",
  ARGB = "ARGB",
  RGB = "RGB"
}

export enum PLACEHOLDER {
  ROOT = "root",
  PROJECT = "project",
  RESOURCE = "resource",
  MODULE = "module",
  NAMESPACE = "namespace"
}

// 文件变动类型
export enum FILE_EVENT {
  ADD = "add", // 增加
  CHANGE = "change", // 内容变更
  UNLINK = "unlink", // 删除
  ADD_DIR = "addDir"
}

// 打包方式类型
export enum PACK_TYPE {
  COPY = "copy",
  PACK = "pack"
}

// 扩展数据字段
export enum EXTRA_DATA_TYPE {
  PATH_CONFIG = "pathConfig",
  SERVER_CONFIG = "server"
}

// 工具栏按钮
export enum TOOLS_BAR_BUTTON {
  MODULE_TOGGLE = "模块栏",
  PAGE_TOGGLE = "页面栏",
  PREVIEW_TOGGLE = "预览",
  APPLY = "应用",
  SAVE = "保存",
  EXPORT = "导出",
  INFO = "信息",
  DARK = "深色",
  LIGHT = "浅色",
  PLACEHOLDER = ""
}

// 文件模板类型
export enum FILE_TEMPLATE_TYPE {
  UNKNOWN = "unknown",
  INFO = "info"
}

// 协议名称
export enum PROTOCOL_TYPE {
  app = "app",
  resource = "resource",
  project = "project",
  src = "src",
  thumbnail = "thumbnail"
}
