import {
  TypeLayoutConf,
  TypeSourceConfigData,
  TypeSourceConfigInfo,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourcePageData,
  TypeSourcePageGroupConf,
  TypeSourceTypeConf
} from "../types/source-config";
import { TypeProjectUiVersion } from "../types/project";
import { AbstractDataModel } from "../types/data-model";
import { ALIGN_VALUES, ALIGN_V_VALUES } from "./../enum/index";

export class SourcePageConf extends AbstractDataModel<TypeSourcePageConf> {
  data = {
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
  data = {
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

export class SourcePageData extends AbstractDataModel<TypeSourcePageData> {
  data = {
    url: "",
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
  data = {
    name: "",
    pageList: []
  };

  static default(): TypeSourcePageConf {
    return new SourcePageConf().default();
  }
}

export class SourceModuleConf extends AbstractDataModel<TypeSourceModuleConf> {
  data = {
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
  data = {
    tag: "",
    name: "",
    type: ""
  };

  static default(): TypeSourceTypeConf {
    return new SourceTypeConf().default();
  }
}

export class UiVersion extends AbstractDataModel<TypeProjectUiVersion> {
  data = {
    name: "",
    code: ""
  };
  static default(): TypeProjectUiVersion {
    return new UiVersion().default();
  }
}

export class SourceConfigInfo extends AbstractDataModel<TypeSourceConfigInfo> {
  data = {
    key: "",
    url: "",
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
  data = {
    ...SourceConfigInfo.default(),
    sourceTypeList: [],
    moduleList: []
  };
  static default(): TypeSourceConfigData {
    return new SourceConfigData().default();
  }
}
