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
  PackConfig = "PackConfig",
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
  Previews = "Previews",
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
  Items = "Items"
}

// 元素类型
export enum ELEMENT_TYPE {
  IMAGE = "image",
  TEXT = "text"
}

// 文件协议
export enum FILE_PROTOCOL {
  UNKNOWN = "unknown",
  IMAGE = "image",
  XML = "xml"
}

// 资源类型
export enum RESOURCE_TYPES {
  UNKNOWN = "unknown",
  IMAGE = "image",
  COLOR = "color",
  BOOLEAN = "boolean",
  NUMBER = "number",
  STRING = "string"
}

export enum ALIGN_VALUES {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right"
}

export enum ALIGN_V_VALUES {
  TOP = "top",
  CENTER = "center",
  BOTTOM = "bottom"
}

// 颜色格式化
export enum HEX_FORMAT {
  RGBA = "rgba",
  ARGB = "argb",
  RGB = "rgb"
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
  UNLINK = "unlink" // 删除
}

// 打包方式类型
export enum PACK_TYPE {
  DIR = "dir",
  PACK = "pack",
  FILE = "file"
}

// 扩展数据字段
export enum EXTRA_DATA_TYPE {
  PATH_CONFIG = "pathConfig",
  SERVER_CONFIG = "server"
}

// 工具栏按钮
export enum TOOLS_BAR_BUTTON {
  CREATE = "新建",
  OPEN = "打开",
  JUMP = "跳转",
  APPLY = "应用",
  SAVE = "保存",
  EXPORT = "导出",
  INFO = "资料",
  DARK = "深色",
  LIGHT = "浅色",
  PLACEHOLDER = ""
}

// 文件模板类型
export enum FILE_TEMPLATE_TYPE {
  UNKNOWN = "unknown",
  INFO = "info"
}
