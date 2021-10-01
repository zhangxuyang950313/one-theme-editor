import {
  TypeLayoutConf,
  TypeSourceConfig,
  TypeSourceOption,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeSourceModuleConf,
  TypeSourcePageOption,
  TypeSourcePageConf,
  TypeSourcePageGroupConf,
  TypeSourceTypeConf,
  TypeSourceDefined,
  TypePageDefinedImageData,
  TypePageDefinedValueData,
  TypeSourceImageDefined
} from "../types/source";
import { TypeProjectUiVersion } from "../types/project";
import {
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  ELEMENT_TAG,
  SOURCE_TYPES
} from "../enum/index";
import { AbstractDataModel } from "./AbstractDataModel";

export class SourcePageOption extends AbstractDataModel<TypeSourcePageOption> {
  protected data: TypeSourcePageOption = {
    key: "",
    name: "",
    preview: "",
    src: ""
  };

  static default = new SourcePageOption().create();
}

export class DefinedImageData extends AbstractDataModel<TypePageDefinedImageData> {
  protected data: TypePageDefinedImageData = {
    width: 0,
    height: 0,
    size: 0,
    ninePatch: false,
    filename: ""
  };
  static default = new DefinedImageData().create();
}

export class DefinedValueData extends AbstractDataModel<TypePageDefinedValueData> {
  protected data: TypePageDefinedValueData = {
    defaultValue: "",
    valueName: ""
  };
}

export class SourceDefinedData extends AbstractDataModel<TypeSourceDefined> {
  protected data: TypeSourceImageDefined = {
    tagName: "",
    name: "",
    description: "",
    src: "",
    sourceData: null,
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

export class SourceImageElement extends AbstractDataModel<TypeLayoutImageElement> {
  protected data: TypeLayoutImageElement = {
    sourceTag: ELEMENT_TAG.Image,
    sourceType: SOURCE_TYPES.IMAGE,
    description: "",
    src: "",
    sourceData: new DefinedImageData().create(),
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

export class SourceTextElement extends AbstractDataModel<TypeLayoutTextElement> {
  protected data: TypeLayoutTextElement = {
    sourceTag: ELEMENT_TAG.Text,
    sourceType: SOURCE_TYPES.COLOR,
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

export class SourcePageConfig extends AbstractDataModel<TypeSourcePageConf> {
  protected data: TypeSourcePageConf = {
    config: "",
    version: "",
    description: "",
    screenWidth: "",
    previewList: [],
    sourceDefineList: [],
    layoutElementList: []
  };
}

export class SourcePageGroupConf extends AbstractDataModel<TypeSourcePageGroupConf> {
  protected data: TypeSourcePageGroupConf = {
    name: "",
    pageList: []
  };

  static default = new SourcePageOption().create();
}

export class SourceModuleConf extends AbstractDataModel<TypeSourceModuleConf> {
  protected data: TypeSourceModuleConf = {
    index: 0,
    name: "",
    icon: "",
    groupList: []
  };

  static default = new SourceModuleConf().create();
}

export class SourceTypeConf extends AbstractDataModel<TypeSourceTypeConf> {
  protected data: TypeSourceTypeConf = {
    name: "",
    tag: "",
    type: SOURCE_TYPES.STRING
  };

  static default = new SourceTypeConf().create();
}

export class UiVersion extends AbstractDataModel<TypeProjectUiVersion> {
  protected data: TypeProjectUiVersion = {
    name: "",
    code: ""
  };
  static default = new UiVersion().create();
}

export class SourceOption extends AbstractDataModel<TypeSourceOption> {
  protected data: TypeSourceOption = {
    key: "",
    namespace: "",
    config: "",
    name: "",
    preview: "",
    version: "",
    uiVersion: UiVersion.default
  };
  static default = new SourceOption().create();
}

export default class SourceConfig extends AbstractDataModel<TypeSourceConfig> {
  protected data: TypeSourceConfig = {
    ...SourceOption.default,
    sourceTypeList: [],
    sourceModuleList: []
  };
  static default = new SourceConfig().create();
}
