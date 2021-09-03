// 设置页面标题
export enum PRESET_TITLE {
  default = "一个主题编辑器"
}

export enum ELEMENT_TAG {
  Image = "Image",
  Text = "Text",
  Page = "Page",
  Module = "Module",
  Package = "Package",
  Item = "Item",
  Apply = "Apply",
  Step = "Step",
  Exclude = "Exclude",
  Group = "Group",
  Source = "Source",
  Previews = "Previews",
  Preview = "Preview",
  UiVersion = "UiVersion",
  Layout = "Layout",
  Templates = "Templates",
  Template = "Template",
  Value = "Value",
  Color = "Color",
  Brand = "Brand",
  Config = "Config",
  InfoTemplate = "InfoTemplate"
}

// 元素类型
export enum ELEMENT_TYPE {
  IMAGE = "image",
  TEXT = "text"
}

// 资源类型
export enum SOURCE_TYPES {
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
  SOURCE = "source",
  MODULE = "module",
  NAMESPACE = "namespace"
}

// 工程文件类型
export enum PROJECT_FILE_TYPE {
  XML = "xml",
  IMAGE = "image"
}

// 文件变动类型
export enum FILE_STATUS {
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

// 扩展数据类型
export enum EXTRA_DATA_TYPE {
  PATH_CONFIG = "pathConfig"
}
