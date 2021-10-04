import {
  TypeLayoutData,
  TypeResourceConfig,
  TypeResourceOption,
  TypeLayoutImage,
  TypeLayoutText,
  TypeResModule,
  TypeResPageOption,
  TypeResPageConfig,
  TypeResPageGroup,
  TypeResTypeConfig,
  TypeResDefinition,
  TypeXmlValueData
} from "../types/resource";
import { TypeImageData, TypeUiVersion } from "../types/project";
import {
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  ELEMENT_TAG,
  RESOURCE_PROTOCOL,
  RESOURCE_TYPES
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
  static get default(): TypeImageData {
    return new ImageData().create();
  }
}

export class ResDefinition extends AbstractDataModel<TypeResDefinition> {
  protected data: TypeResDefinition = {
    protocol: RESOURCE_PROTOCOL.UNKNOWN,
    type: RESOURCE_TYPES.UNKNOWN,
    name: "",
    desc: "",
    src: "",
    data: null
  };
  static get default(): TypeResDefinition {
    return new ResDefinition().create();
  }
}

export class ElementLayoutConfig extends AbstractDataModel<TypeLayoutData> {
  protected data: TypeLayoutData = {
    x: "0",
    y: "0",
    w: "0",
    h: "0",
    align: ALIGN_VALUES.LEFT,
    alignV: ALIGN_V_VALUES.TOP
  };

  static get default(): TypeLayoutData {
    return new ElementLayoutConfig().create();
  }
}

export class LayoutImageElement extends AbstractDataModel<TypeLayoutImage> {
  protected data: TypeLayoutImage = {
    type: RESOURCE_TYPES.IMAGE,
    tag: ELEMENT_TAG.Image,
    src: "",
    desc: "",
    data: ImageData.default,
    layout: ElementLayoutConfig.default
  };
  static get default(): TypeLayoutImage {
    return new LayoutImageElement().create();
  }
}

export class LayoutTextElement extends AbstractDataModel<TypeLayoutText> {
  protected data: TypeLayoutText = {
    type: RESOURCE_TYPES.COLOR,
    tag: ELEMENT_TAG.Text,
    desc: "",
    text: "",
    src: "",
    data: {
      defaultValue: "",
      valueName: ""
    },
    layout: ElementLayoutConfig.default
  };
  static get default(): TypeLayoutText {
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

export class ResPageGroup extends AbstractDataModel<TypeResPageGroup> {
  protected data: TypeResPageGroup = {
    name: "",
    pageList: []
  };

  static get default(): TypeResPageGroup {
    return new ResPageGroup().create();
  }
}

export class ResModuleConfig extends AbstractDataModel<TypeResModule> {
  protected data: TypeResModule = {
    index: 0,
    name: "",
    icon: "",
    pageGroupList: []
  };

  static get default(): TypeResModule {
    return new ResModuleConfig().create();
  }
}

export class ResTypeConfig extends AbstractDataModel<TypeResTypeConfig> {
  protected data: TypeResTypeConfig = {
    type: RESOURCE_TYPES.UNKNOWN,
    protocol: RESOURCE_PROTOCOL.UNKNOWN,
    name: "",
    tag: ""
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
