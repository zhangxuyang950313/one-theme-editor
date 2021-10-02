import {
  TypeLayoutConfig,
  TypeResourceConfig,
  TypeResourceOption,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeResModule,
  TypeResPageOption,
  TypeResPageConfig,
  TypeResPageGroup,
  TypeResTypeData,
  TypeResDefinition,
  TypeResValueData
} from "../types/resource";
import { TypeImageData, TypeUiVersion } from "../types/project";
import {
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  ELEMENT_TAG,
  RESOURCE_CATEGORY,
  VALUE_RESOURCE_TYPES
} from "../enum/index";
import ImageData from "../data/ImageData";
import { AbstractDataModel } from "./AbstractDataModel";

export class ResourcePageOption extends AbstractDataModel<TypeResPageOption> {
  protected data: TypeResPageOption = {
    key: "",
    name: "",
    preview: "",
    src: ""
  };

  static default = new ResourcePageOption().create();
}

export class ResImageData extends AbstractDataModel<TypeImageData> {
  protected data: TypeImageData = ImageData.default;
  static default = ImageData.default;
}

export class ResValueData extends AbstractDataModel<TypeResValueData> {
  protected data: TypeResValueData = {
    defaultValue: "",
    valueName: ""
  };
}

export class ResDefinitionData extends AbstractDataModel<TypeResDefinition> {
  protected data: TypeResDefinition = {
    type: RESOURCE_CATEGORY.UNKNOWN,
    tag: "",
    name: "",
    desc: "",
    src: "",
    data: null
  };
}

export class ElementLayoutConf extends AbstractDataModel<TypeLayoutConfig> {
  protected data: TypeLayoutConfig = {
    x: "",
    y: "",
    w: "",
    h: "",
    align: ALIGN_VALUES.LEFT,
    alignV: ALIGN_V_VALUES.TOP
  };

  static default = new ElementLayoutConf().create();
}

export class LayoutImageElement extends AbstractDataModel<TypeLayoutImageElement> {
  protected data: TypeLayoutImageElement = {
    type: VALUE_RESOURCE_TYPES.IMAGE,
    tag: ELEMENT_TAG.Image,
    src: "",
    desc: "",
    data: ResImageData.default,
    layout: {
      x: "0",
      y: "0",
      w: "0",
      h: "0",
      align: ALIGN_VALUES.LEFT,
      alignV: ALIGN_V_VALUES.TOP
    }
  };
}

export class LayoutTextElement extends AbstractDataModel<TypeLayoutTextElement> {
  protected data: TypeLayoutTextElement = {
    type: VALUE_RESOURCE_TYPES.COLOR,
    tag: ELEMENT_TAG.Text,
    name: "",
    text: "",
    src: "",
    data: {
      defaultValue: "",
      valueName: ""
    },
    layout: {
      x: "0",
      y: "0",
      align: ALIGN_VALUES.LEFT,
      alignV: ALIGN_V_VALUES.TOP
    }
  };
}

export class ResourcePageConfig extends AbstractDataModel<TypeResPageConfig> {
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

export class ResourcePageGroupConf extends AbstractDataModel<TypeResPageGroup> {
  protected data: TypeResPageGroup = {
    name: "",
    pageList: []
  };

  static default = new ResourcePageOption().create();
}

export class ResourceModuleConf extends AbstractDataModel<TypeResModule> {
  protected data: TypeResModule = {
    index: 0,
    name: "",
    icon: "",
    groupList: []
  };

  static default = new ResourceModuleConf().create();
}

export class ResourceTypeConf extends AbstractDataModel<TypeResTypeData> {
  protected data: TypeResTypeData = {
    type: VALUE_RESOURCE_TYPES.STRING,
    name: "",
    tag: ""
  };

  static default = new ResourceTypeConf().create();
}

export class UiVersion extends AbstractDataModel<TypeUiVersion> {
  protected data: TypeUiVersion = {
    name: "",
    code: ""
  };
  static default = new UiVersion().create();
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
  static default = new ResourceOption().create();
}

export default class ResourceConfigData extends AbstractDataModel<TypeResourceConfig> {
  protected data: TypeResourceConfig = {
    ...ResourceOption.default,
    typeList: [],
    moduleList: []
  };
  static default = new ResourceConfigData().create();
}
