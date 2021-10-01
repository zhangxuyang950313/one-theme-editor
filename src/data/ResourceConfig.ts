import {
  TypeLayoutConf,
  TypeResourceConfig,
  TypeResourceOption,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeResourceModuleConf,
  TypeResourcePageOption,
  TypeResourcePageConf,
  TypeResourcePageGroupConf,
  TypeResourceTypeConf,
  TypeResourceDefinition,
  TypeResourceImageData,
  TypeResourceValueData,
  TypeResourceImageDefinition
} from "../types/resource";
import { TypeProjectUiVersion } from "../types/project";
import {
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  ELEMENT_TAG,
  RESOURCE_TYPES
} from "../enum/index";
import { AbstractDataModel } from "./AbstractDataModel";

export class ResourcePageOption extends AbstractDataModel<TypeResourcePageOption> {
  protected data: TypeResourcePageOption = {
    key: "",
    name: "",
    preview: "",
    src: ""
  };

  static default = new ResourcePageOption().create();
}

export class DefinitionImageData extends AbstractDataModel<TypeResourceImageData> {
  protected data: TypeResourceImageData = {
    width: 0,
    height: 0,
    size: 0,
    ninePatch: false,
    filename: ""
  };
  static default = new DefinitionImageData().create();
}

export class DefinitionValueData extends AbstractDataModel<TypeResourceValueData> {
  protected data: TypeResourceValueData = {
    defaultValue: "",
    valueName: ""
  };
}

export class SourceDefinitionData extends AbstractDataModel<TypeResourceDefinition> {
  protected data: TypeResourceImageDefinition = {
    tagName: "",
    name: "",
    description: "",
    src: "",
    resourceData: null,
    valueData: null
  };
}

export class ElementLayoutConf extends AbstractDataModel<TypeLayoutConf> {
  protected data: TypeLayoutConf = {
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
    resourceTag: ELEMENT_TAG.Image,
    resourceType: RESOURCE_TYPES.IMAGE,
    description: "",
    src: "",
    resourceData: new DefinitionImageData().create(),
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
    resourceTag: ELEMENT_TAG.Text,
    resourceType: RESOURCE_TYPES.COLOR,
    name: "",
    text: "",
    src: "",
    valueData: {
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

export class ResourcePageConfig extends AbstractDataModel<TypeResourcePageConf> {
  protected data: TypeResourcePageConf = {
    config: "",
    version: "",
    description: "",
    screenWidth: "",
    previewList: [],
    resourceDefinitionList: [],
    layoutElementList: []
  };
}

export class ResourcePageGroupConf extends AbstractDataModel<TypeResourcePageGroupConf> {
  protected data: TypeResourcePageGroupConf = {
    name: "",
    pageList: []
  };

  static default = new ResourcePageOption().create();
}

export class ResourceModuleConf extends AbstractDataModel<TypeResourceModuleConf> {
  protected data: TypeResourceModuleConf = {
    index: 0,
    name: "",
    icon: "",
    groupList: []
  };

  static default = new ResourceModuleConf().create();
}

export class ResourceTypeConf extends AbstractDataModel<TypeResourceTypeConf> {
  protected data: TypeResourceTypeConf = {
    name: "",
    tag: "",
    type: RESOURCE_TYPES.STRING
  };

  static default = new ResourceTypeConf().create();
}

export class UiVersion extends AbstractDataModel<TypeProjectUiVersion> {
  protected data: TypeProjectUiVersion = {
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
    resourceTypeList: [],
    resourceModuleList: []
  };
  static default = new ResourceConfigData().create();
}
