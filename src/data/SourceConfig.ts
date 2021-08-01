import {
  TypeLayoutConf,
  TypeSourceConfigData,
  TypeSourceConfigInfo,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourcePageData,
  TypeSourcePageGroupConf,
  TypeSourceTypeConf,
  TypeSourceDefine,
  TypePageDefineImageData,
  TypePageDefineValueData,
  TypeSourceDefineImage
} from "../types/source";
import { TypeProjectUiVersion } from "../types/project";
import {
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  ELEMENT_TAG,
  SOURCE_TYPES
} from "../enum/index";
import { AbstractDataModel } from "./AbstractDataModel";

export class SourcePageConf extends AbstractDataModel<TypeSourcePageConf> {
  protected data: TypeSourcePageConf = {
    key: "",
    name: "",
    preview: "",
    src: ""
  };

  static default(): TypeSourcePageConf {
    return new SourcePageConf().default();
  }
}

export class DefineSourceData extends AbstractDataModel<TypePageDefineImageData> {
  protected data: TypePageDefineImageData = {
    width: 0,
    height: 0,
    size: 0,
    ninePatch: false,
    filename: ""
  };
}

export class DefineValueData extends AbstractDataModel<TypePageDefineValueData> {
  protected data: TypePageDefineValueData = {
    defaultValue: "",
    valueName: ""
  };
}

export class SourceDefineData extends AbstractDataModel<TypeSourceDefine> {
  protected data: TypeSourceDefineImage = {
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

  static default(): TypeLayoutConf {
    return new ElementLayoutConf().default();
  }
}

export class SourceImageElement extends AbstractDataModel<TypeLayoutImageElement> {
  protected data: TypeLayoutImageElement = {
    sourceTag: ELEMENT_TAG.IMAGE,
    sourceType: SOURCE_TYPES.IMAGE,
    description: "",
    src: "",
    sourceData: new DefineSourceData().default(),
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
    sourceTag: ELEMENT_TAG.TEXT,
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

export class SourcePageData extends AbstractDataModel<TypeSourcePageData> {
  protected data: TypeSourcePageData = {
    config: "",
    version: "",
    description: "",
    screenWidth: "",
    previewList: [],
    sourceDefineList: [],
    layoutElementList: [],
    copyList: []
  };
}

export class SourcePageGroupConf extends AbstractDataModel<TypeSourcePageGroupConf> {
  protected data: TypeSourcePageGroupConf = {
    name: "",
    pageList: []
  };

  static default(): TypeSourcePageConf {
    return new SourcePageConf().default();
  }
}

export class SourceModuleConf extends AbstractDataModel<TypeSourceModuleConf> {
  protected data: TypeSourceModuleConf = {
    index: 0,
    name: "",
    icon: "",
    groupList: []
  };

  static default(): TypeSourceModuleConf {
    return new SourceModuleConf().default();
  }
}

export class SourceTypeConf extends AbstractDataModel<TypeSourceTypeConf> {
  protected data: TypeSourceTypeConf = {
    name: "",
    tag: "",
    type: SOURCE_TYPES.STRING
  };

  static default(): TypeSourceTypeConf {
    return new SourceTypeConf().default();
  }
}

export class UiVersion extends AbstractDataModel<TypeProjectUiVersion> {
  protected data: TypeProjectUiVersion = {
    name: "",
    code: ""
  };
  static default(): TypeProjectUiVersion {
    return new UiVersion().default();
  }
}

export class SourceConfigInfo extends AbstractDataModel<TypeSourceConfigInfo> {
  protected data: TypeSourceConfigInfo = {
    key: "",
    root: "",
    config: "",
    name: "",
    preview: "",
    version: "",
    uiVersion: UiVersion.default()
  };
  static default(): TypeSourceConfigInfo {
    return new SourceConfigInfo().default();
  }
}

export class SourceConfigData extends AbstractDataModel<TypeSourceConfigData> {
  protected data: TypeSourceConfigData = {
    ...SourceConfigInfo.default(),
    sourceTypeList: [],
    moduleList: []
  };
  static default(): TypeSourceConfigData {
    return new SourceConfigData().default();
  }
}
