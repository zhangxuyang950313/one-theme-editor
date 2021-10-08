import {
  TypeLayoutData,
  TypeResourceConfig,
  TypeResourceOption,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeResModule,
  TypeResPageOption,
  TypeResPageConfig,
  TypeResTypeConfig,
  TypeXmlValueData,
  TypeResUrlData,
  TypeResImageDefinition,
  TypeResXmlValDefinition,
  TypeXmlValSourceData,
  TypeImageSourceData
} from "../types/resource";
import { TypeUiVersion } from "../types/project";
import {
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  ELEMENT_TAG,
  FILE_TYPE,
  RESOURCE_PROTOCOL,
  RESOURCE_TYPE
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

export class XmlValueData extends AbstractDataModel<TypeXmlValueData> {
  protected data: TypeXmlValueData = {
    defaultValue: "",
    valueName: ""
  };
  static get default(): TypeXmlValueData {
    return new XmlValueData().create();
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
export class ResImageDefinition extends AbstractDataModel<TypeResImageDefinition> {
  protected data: TypeResImageDefinition = {
    name: "",
    desc: "",
    resType: RESOURCE_TYPE.IMAGE,
    fileType: FILE_TYPE.IMAGE,
    url: "",
    source: "",
    sourceData: ImageSourceData.default
  };
  static get default(): TypeResImageDefinition {
    return new ResImageDefinition().create();
  }
}

export class XmlValSourceData extends AbstractDataModel<TypeXmlValSourceData> {
  protected data: TypeXmlValSourceData = {
    fileType: FILE_TYPE.XML,
    protocol: "",
    src: "",
    query: {},
    data: XmlValueData.default
  };
  static get default(): TypeXmlValSourceData {
    return new XmlValSourceData().create();
  }
}
export class XmlValResDefinition extends AbstractDataModel<TypeResXmlValDefinition> {
  protected data: TypeResXmlValDefinition = {
    name: "",
    desc: "",
    resType: RESOURCE_TYPE.UNKNOWN,
    fileType: FILE_TYPE.XML,
    source: "",
    sourceData: XmlValSourceData.default
  };
  static get default(): TypeResXmlValDefinition {
    return new XmlValResDefinition().create();
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
    protocol: RESOURCE_PROTOCOL.UNKNOWN,
    url: "",
    src: "",
    layout: ElementLayoutConfig.default
  };
  static get default(): TypeLayoutImageElement {
    return new LayoutImageElement().create();
  }
}

export class LayoutTextElement extends AbstractDataModel<TypeLayoutTextElement> {
  protected data: TypeLayoutTextElement = {
    tag: ELEMENT_TAG.Text,
    resType: RESOURCE_TYPE.COLOR,
    protocol: RESOURCE_PROTOCOL.UNKNOWN,
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

export class ResModuleConfig extends AbstractDataModel<TypeResModule> {
  protected data: TypeResModule = {
    index: 0,
    name: "",
    icon: "",
    pageList: []
  };

  static get default(): TypeResModule {
    return new ResModuleConfig().create();
  }
}

export class ResTypeConfig extends AbstractDataModel<TypeResTypeConfig> {
  protected data: TypeResTypeConfig = {
    type: RESOURCE_TYPE.UNKNOWN,
    protocol: RESOURCE_PROTOCOL.UNKNOWN,
    name: ""
  };

  static get default(): TypeResTypeConfig {
    return new ResTypeConfig().create();
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
    srcpath: "",
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
