export enum ELEMENT_TAG {
  IMAGE = "Image",
  TEXT = "Text",
  PAGE = "Page",
  MODULE = "Module",
  PACKAGE = "Package",
  ITEM = "Item",
  GROUP = "Group",
  SOURCE = "Source",
  PREVIEWS = "Previews",
  PREVIEW = "Preview",
  UI_VERSION = "UiVersion",
  LAYOUT = "Layout",
  TEMPLATES = "Templates",
  TEMPLATE = "Template",
  VALUE = "Value",
  Color = "Color"
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
