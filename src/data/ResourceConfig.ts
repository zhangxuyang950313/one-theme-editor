import XMLNodeElement from "src/common/classes/XMLNodeElement";
import {
  TypeResourceConfig,
  TypeResourceOption,
  TypeModuleConfig,
  TypePageOption,
  TypePageConfig
} from "src/types/config.resource";
import {
  TypeResourceCategory,
  TypeLayoutData,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeSourceData,
  TypeImageUrlData,
  TypeFileItem,
  TypeFileBlock,
  TypeStringBlock,
  TypeNumberBlock,
  TypeBooleanBlock,
  TypeXmlNodeData,
  TypeValueBlock,
  TypeXmlValueData
} from "src/types/config.page";
import {
  TypeFileData,
  TypeImageFileData,
  TypeXmlFileData
} from "src/types/file-data";

import {
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  HEX_FORMAT,
  LAYOUT_ELEMENT_TAG,
  RESOURCE_TAG
} from "src/common/enums/index";

import { AbstractDataModel } from "./AbstractDataModel";

import type { TypeUiVersion } from "src/types/project";

export class SourceData extends AbstractDataModel<TypeSourceData> {
  protected data: TypeSourceData = {
    protocol: "",
    src: "",
    query: {}
  };
  static get default(): TypeSourceData {
    return new SourceData().create();
  }
}

export class ImageFileData extends AbstractDataModel<TypeImageFileData> {
  protected data: TypeImageFileData = {
    filename: "",
    filetype: "",
    width: 0,
    height: 0,
    size: 0,
    is9patch: false
  };
  static get default(): TypeImageFileData {
    return new ImageFileData().create();
  }
}

export class XmlFileData extends AbstractDataModel<TypeXmlFileData> {
  protected data: TypeXmlFileData = {
    filetype: "application/xml",
    size: 0,
    element: XMLNodeElement.createEmptyNode().getElement(),
    valueMapper: {}
  };
  static get default(): TypeXmlFileData {
    return new XmlFileData().create();
  }
}

export class FileData extends AbstractDataModel<TypeFileData> {
  protected data: TypeFileData = {
    filetype: "",
    size: 0
  };

  static get default(): TypeFileData {
    return new FileData().create();
  }
}

export class FileItem extends AbstractDataModel<TypeFileItem> {
  protected data: TypeFileItem = {
    key: "",
    keyPath: "",
    comment: "",
    sourceUrl: "",
    sourceData: SourceData.default,
    fileData: FileData.default
  };
  static get default(): TypeFileItem {
    return new FileItem().create();
  }
}

export class XmlValueData extends AbstractDataModel<TypeXmlValueData> {
  protected data: TypeXmlValueData = {
    comment: "",
    keyPath: "",
    tag: "",
    attributes: [],
    value: "",
    template: ""
  };
  static get default(): TypeXmlValueData {
    return new XmlValueData().create();
  }
}

export class XmlNodeData extends AbstractDataModel<TypeXmlNodeData> {
  protected data: TypeXmlNodeData = {
    tag: "",
    key: "",
    name: "",
    sourceUrl: "",
    sourceData: SourceData.default,
    fileData: XmlFileData.default,
    valueItems: []
  };
}

export class ValueBlocker extends AbstractDataModel<TypeValueBlock> {
  protected data: TypeValueBlock = {
    tag: RESOURCE_TAG.String,
    key: "",
    name: "",
    items: []
  };
}

export class FileFillerWrapper extends AbstractDataModel<TypeFileBlock> {
  protected data: TypeFileBlock = {
    tag: RESOURCE_TAG.File,
    key: "",
    name: "",
    items: []
  };
}

export class StringBlock extends AbstractDataModel<TypeStringBlock> {
  protected data: TypeStringBlock = {
    tag: RESOURCE_TAG.String,
    key: "",
    name: "",
    items: []
  };
}

export class NumberBlock extends AbstractDataModel<TypeNumberBlock> {
  protected data: TypeNumberBlock = {
    tag: RESOURCE_TAG.Number,
    key: "",
    name: "",
    items: []
  };
}

export class BooleanBlock extends AbstractDataModel<TypeBooleanBlock> {
  protected data: TypeBooleanBlock = {
    tag: RESOURCE_TAG.Boolean,
    key: "",
    name: "",
    items: []
  };
}

export class ResourceDefinition extends AbstractDataModel<TypeResourceCategory> {
  protected data: TypeResourceCategory = {
    key: "",
    name: "",
    extra: {},
    children: []
  };
  static get default(): TypeResourceCategory {
    return new ResourceDefinition().create();
  }
}

export class PageOption extends AbstractDataModel<TypePageOption> {
  protected data: TypePageOption = {
    key: "",
    name: "",
    preview: "",
    src: ""
  };

  static get default(): TypePageOption {
    return new PageOption().create();
  }
}

export class PageConfig extends AbstractDataModel<TypePageConfig> {
  protected data: TypePageConfig = {
    config: "",
    version: "",
    name: "",
    screenWidth: "",
    disableTabs: false,
    colorFormat: HEX_FORMAT.RGBA,
    forceStaticPreview: false,
    previewList: [],
    resourceCategoryList: [],
    layoutElementList: []
  };

  static get default(): TypePageConfig {
    return new PageConfig().create();
  }
}

// export class ResPageGroup extends AbstractDataModel<TypeResPageGroup> {
//   protected data: TypeResPageGroup = {
//     name: "",
//     pageList: []
//   };

//   static get default(): TypeResPageGroup {
//     return new ResPageGroup().create();
//   }
// }

export class ModuleConfig extends AbstractDataModel<TypeModuleConfig> {
  protected data: TypeModuleConfig = {
    name: "",
    icon: "",
    pageList: []
  };

  static get default(): TypeModuleConfig {
    return new ModuleConfig().create();
  }
}

export class UiVersion extends AbstractDataModel<TypeUiVersion> {
  protected data: TypeUiVersion = {
    name: "",
    code: ""
  };
  static get default(): TypeUiVersion {
    return new UiVersion().create();
  }
}

export class ResourceOption extends AbstractDataModel<TypeResourceOption> {
  protected data: TypeResourceOption = {
    key: "",
    namespace: "",
    src: "",
    name: "",
    preview: "",
    version: "",
    uiVersion: UiVersion.default
  };
  static get default(): TypeResourceOption {
    return new ResourceOption().create();
  }
}

// URL 数据
export class ImageUrlData extends AbstractDataModel<TypeImageUrlData> {
  protected data: TypeImageUrlData = {
    protocol: null,
    fileType: null,
    extname: "",
    source: "",
    src: "",
    query: {},
    extra: null
  };
}

export class ElementLayoutConfig extends AbstractDataModel<TypeLayoutData> {
  protected data: TypeLayoutData = {
    x: "0",
    y: "0",
    w: "0",
    h: "0",
    align: ALIGN_VALUE.LEFT,
    alignV: ALIGN_V_VALUE.TOP
  };

  static get default(): TypeLayoutData {
    return new ElementLayoutConfig().create();
  }
}

export class LayoutImageElement extends AbstractDataModel<TypeLayoutImageElement> {
  protected data: TypeLayoutImageElement = {
    tag: LAYOUT_ELEMENT_TAG.Image,
    keyPath: "",
    sourceUrl: "",
    sourceData: SourceData.default,
    layout: ElementLayoutConfig.default
  };
  static get default(): TypeLayoutImageElement {
    return new LayoutImageElement().create();
  }
}

export class LayoutTextElement extends AbstractDataModel<TypeLayoutTextElement> {
  protected data: TypeLayoutTextElement = {
    tag: LAYOUT_ELEMENT_TAG.Text,
    keyPath: "",
    text: "",
    size: "36",
    color: "",
    sourceUrl: "",
    sourceData: SourceData.default,
    valueData: XmlValueData.default,
    layout: ElementLayoutConfig.default
  };
  static get default(): TypeLayoutTextElement {
    return new LayoutTextElement().create();
  }
}

export default class ResourceConfigData extends AbstractDataModel<TypeResourceConfig> {
  protected data: TypeResourceConfig = {
    ...ResourceOption.default,
    moduleList: []
  };
  static get default(): TypeResourceConfig {
    return new ResourceConfigData().create();
  }
}
