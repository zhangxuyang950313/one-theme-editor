import {
  TypeLayoutConf,
  TypeSourceConfigData,
  TypeSourceConfigInfo,
  TypeSourceImageElement,
  TypeSourceValueElement,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourcePageData,
  TypeSourcePageGroupConf,
  TypeSourceTypeConf
} from "../types/source-config";
import { TypeProjectUiVersion } from "../types/project";
import {
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  ELEMENT_TAG,
  VALUE_TYPES
} from "../enum/index";
import { AbstractDataModel } from "./abstract";

export class SourcePageConf extends AbstractDataModel<TypeSourcePageConf> {
  protected data = {
    key: "",
    name: "",
    preview: "",
    src: ""
  };

  static default(): TypeSourcePageConf {
    return new SourcePageConf().default();
  }
}

export class ElementLayoutConf extends AbstractDataModel<TypeLayoutConf> {
  protected data = {
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

export class SourceImageElement extends AbstractDataModel<TypeSourceImageElement> {
  protected data: TypeSourceImageElement = {
    elementType: ELEMENT_TAG.IMAGE,
    valueType: VALUE_TYPES.SOURCE,
    name: "",
    source: {
      width: 0,
      height: 0,
      size: 0,
      filename: "",
      ninePatch: false,
      src: "",
      release: ""
    },
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

export class SourceValueElement extends AbstractDataModel<TypeSourceValueElement> {
  protected data: TypeSourceValueElement = {
    elementType: ELEMENT_TAG.TEXT,
    valueType: VALUE_TYPES.COLOR,
    name: "",
    text: "",
    value: {
      valueName: "",
      valueSrc: "",
      defaultValue: ""
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
    elementList: [],
    templateList: [],
    copyList: []
  };
}

export class SourcePageGroupConf extends AbstractDataModel<TypeSourcePageGroupConf> {
  protected data = {
    name: "",
    pageList: []
  };

  static default(): TypeSourcePageConf {
    return new SourcePageConf().default();
  }
}

export class SourceModuleConf extends AbstractDataModel<TypeSourceModuleConf> {
  protected data = {
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
  protected data = {
    tag: "",
    name: "",
    type: ""
  };

  static default(): TypeSourceTypeConf {
    return new SourceTypeConf().default();
  }
}

export class UiVersion extends AbstractDataModel<TypeProjectUiVersion> {
  protected data = {
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
  protected data = {
    ...SourceConfigInfo.default(),
    sourceTypeList: [],
    moduleList: []
  };
  static default(): TypeSourceConfigData {
    return new SourceConfigData().default();
  }
}
