import XMLNodeElement from "server/compiler/XMLNodeElement";
import {
  TypeResourceConfig,
  TypeResourceOption,
  TypeModuleConfig,
  TypePageOption,
  TypePageConfig
} from "../types/resource.config";
import {
  TypeResourceDefinition,
  TypeLayoutData,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeSourceData,
  TypeImageUrlData,
  TypeFileItem,
  TypeFileBlocker,
  TypeStringBlocker,
  TypeNumberBlocker,
  TypeBooleanBlocker,
  TypeXmlItem,
  TypeXmlBlocker,
  TypeXmlValueItem,
  TypeFileData,
  TypeImageFileData,
  TypeXmlFileData
} from "../types/resource.page";
import { TypeUiVersion } from "../types/project";
import {
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  LAYOUT_ELEMENT_TAG,
  RESOURCE_TAG
} from "../enum/index";
import { AbstractDataModel } from "./AbstractDataModel";

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
    fileType: "",
    width: 0,
    height: 0,
    size: 0,
    is9patch: false
  };
}

export class XmlFileData extends AbstractDataModel<TypeXmlFileData> {
  protected data: TypeXmlFileData = {
    fileType: "",
    size: 0,
    element: XMLNodeElement.createEmptyNode().getElement()
  };
  static get default(): TypeXmlFileData {
    return new XmlFileData().create();
  }
}

export class FileData extends AbstractDataModel<TypeFileData> {
  protected data: TypeFileData = {
    fileType: "",
    size: 0
  };

  static get default(): TypeFileData {
    return new FileData().create();
  }
}

export class FileItem extends AbstractDataModel<TypeFileItem> {
  protected data: TypeFileItem = {
    key: "",
    comment: "",
    source: "",
    sourceData: SourceData.default,
    fileData: FileData.default
  };
  static get default(): TypeFileItem {
    return new FileItem().create();
  }
}

export class XmlValueItem extends AbstractDataModel<TypeXmlValueItem> {
  protected data: TypeXmlValueItem = {
    comment: "",
    tag: "",
    attributes: [],
    value: ""
  };
}

export class XmlItem extends AbstractDataModel<TypeXmlItem> {
  protected data: TypeXmlItem = {
    tag: "",
    key: "",
    name: "",
    source: "",
    sourceData: SourceData.default,
    fileData: XmlFileData.default,
    valueItems: []
  };
}

export class XmlBlocker extends AbstractDataModel<TypeXmlBlocker> {
  protected data: TypeXmlBlocker = {
    tag: RESOURCE_TAG.String,
    key: "",
    name: "",
    items: []
  };
}

export class FileBlocker extends AbstractDataModel<TypeFileBlocker> {
  protected data: TypeFileBlocker = {
    tag: RESOURCE_TAG.File,
    key: "",
    name: "",
    items: []
  };
}

export class StringBlock extends AbstractDataModel<TypeStringBlocker> {
  protected data: TypeStringBlocker = {
    tag: RESOURCE_TAG.String,
    key: "",
    name: "",
    items: []
  };
}

export class NumberBlock extends AbstractDataModel<TypeNumberBlocker> {
  protected data: TypeNumberBlocker = {
    tag: RESOURCE_TAG.Number,
    key: "",
    name: "",
    items: []
  };
}

export class BooleanBlock extends AbstractDataModel<TypeBooleanBlocker> {
  protected data: TypeBooleanBlocker = {
    tag: RESOURCE_TAG.Boolean,
    key: "",
    name: "",
    items: []
  };
}

export class ResourceDefinition extends AbstractDataModel<TypeResourceDefinition> {
  protected data: TypeResourceDefinition = {
    key: "",
    name: "",
    children: []
  };
  static get default(): TypeResourceDefinition {
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
    previewList: [],
    resourceList: [],
    layoutElementList: []
  };
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
    index: 0,
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
    config: "",
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
    source: "",
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
    text: "",
    size: "20",
    color: "#ffffff",
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
