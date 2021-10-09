import {
  TypeLayoutData,
  TypeResourceConfig,
  TypeResourceOption,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeResModuleConfig,
  TypeResPageOption,
  TypeResPageConfig,
  TypeResUrlData,
  TypeImageResource,
  TypeImageResourceItem,
  TypeXmlValueResource,
  TypeXmlValSourceData,
  TypeImageSourceData,
  TypeResTypeImageConfig,
  TypeResTypeXmlValueConfig,
  TypeXmlValueResourceItem
} from "../types/resource";
import { TypeUiVersion } from "../types/project";
import {
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  ELEMENT_TAG,
  FILE_TYPE,
  RESOURCE_TYPE,
  VALUE_RESOURCE_CATEGORY,
  RESOURCE_PROTOCOL
} from "../enum/index";
import ImageData from "../data/ImageData";
import { AbstractDataModel } from "./AbstractDataModel";

export class ResPageOption extends AbstractDataModel<TypeResPageOption> {
  protected data: TypeResPageOption = {
    key: "",
    name: "",
    preview: "",
    src: ""
  };

  static get default(): TypeResPageOption {
    return new ResPageOption().create();
  }
}

export class ImageSourceData extends AbstractDataModel<TypeImageSourceData> {
  protected data: TypeImageSourceData = {
    fileType: FILE_TYPE.IMAGE,
    extname: "",
    protocol: "",
    src: "",
    query: {},
    data: ImageData.default
  };
  static get default(): TypeImageSourceData {
    return new ImageSourceData().create();
  }
}
export class ImageResource extends AbstractDataModel<TypeImageResource> {
  protected data: TypeImageResource = {
    resType: RESOURCE_TYPE.IMAGE,
    name: "",
    description: "",
    items: []
  };
  static get default(): TypeImageResource {
    return new ImageResource().create();
  }
}
export class ImageResourceItem extends AbstractDataModel<TypeImageResourceItem> {
  protected data: TypeImageResourceItem = {
    name: "",
    description: "",
    source: "",
    sourceData: ImageSourceData.default
  };
  static get default(): TypeImageResourceItem {
    return new ImageResourceItem().create();
  }
}

export class XmlValSourceData extends AbstractDataModel<TypeXmlValSourceData> {
  protected data: TypeXmlValSourceData = {
    fileType: FILE_TYPE.XML,
    protocol: "",
    src: "",
    query: {}
  };
  static get default(): TypeXmlValSourceData {
    return new XmlValSourceData().create();
  }
}
export class XmlValueResourceItem extends AbstractDataModel<TypeXmlValueResourceItem> {
  protected data: TypeXmlValueResourceItem = {
    tag: "",
    name: "",
    description: "",
    value: ""
  };
  static get default(): TypeXmlValueResourceItem {
    return new XmlValueResourceItem().create();
  }
}
export class XmlValueResource extends AbstractDataModel<TypeXmlValueResource> {
  protected data: TypeXmlValueResource = {
    resType: RESOURCE_TYPE.XML_VALUE,
    name: "",
    description: "",
    source: "",
    sourceData: XmlValSourceData.default,
    items: []
  };
  static get default(): TypeXmlValueResource {
    return new XmlValueResource().create();
  }
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
    tag: ELEMENT_TAG.Image,
    resType: RESOURCE_TYPE.IMAGE,
    source: "",
    sourceData: ImageSourceData.default,
    layout: ElementLayoutConfig.default
  };
  static get default(): TypeLayoutImageElement {
    return new LayoutImageElement().create();
  }
}

export class LayoutTextElement extends AbstractDataModel<TypeLayoutTextElement> {
  protected data: TypeLayoutTextElement = {
    tag: ELEMENT_TAG.Text,
    resType: RESOURCE_TYPE.XML_VALUE,
    text: "",
    color: "",
    layout: ElementLayoutConfig.default
  };
  static get default(): TypeLayoutTextElement {
    return new LayoutTextElement().create();
  }
}

export class ResPageConfig extends AbstractDataModel<TypeResPageConfig> {
  protected data: TypeResPageConfig = {
    config: "",
    version: "",
    description: "",
    screenWidth: "",
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

export class ResModuleConfig extends AbstractDataModel<TypeResModuleConfig> {
  protected data: TypeResModuleConfig = {
    index: 0,
    name: "",
    icon: "",
    pageList: []
  };

  static get default(): TypeResModuleConfig {
    return new ResModuleConfig().create();
  }
}

export class ResTypeImageConfig extends AbstractDataModel<TypeResTypeImageConfig> {
  protected data: TypeResTypeImageConfig = {
    type: RESOURCE_TYPE.IMAGE,
    name: ""
  };
  static get default(): TypeResTypeImageConfig {
    return new ResTypeImageConfig().create();
  }
}

export class ResTypeXmlValTypeConfig extends AbstractDataModel<TypeResTypeXmlValueConfig> {
  protected data: TypeResTypeXmlValueConfig = {
    type: RESOURCE_TYPE.XML_VALUE,
    name: "",
    tag: "",
    use: VALUE_RESOURCE_CATEGORY.UNKNOWN
  };
  static get default(): TypeResTypeXmlValueConfig {
    return new ResTypeXmlValTypeConfig().create();
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
export class ResourceUrlData extends AbstractDataModel<TypeResUrlData> {
  protected data: TypeResUrlData = {
    protocol: RESOURCE_PROTOCOL.UNKNOWN,
    fileType: FILE_TYPE.UNKNOWN,
    extname: "",
    source: "",
    src: "",
    query: {},
    data: null
  };
}

export default class ResourceConfigData extends AbstractDataModel<TypeResourceConfig> {
  protected data: TypeResourceConfig = {
    ...ResourceOption.default,
    resTypeList: [],
    moduleList: []
  };
  static get default(): TypeResourceConfig {
    return new ResourceConfigData().create();
  }
}
