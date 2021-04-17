import {
  TypeBrandInfo,
  TypeProjectInfo,
  TypeTemplateConf,
  TypeUiVersionConf,
  TypePreviewConf,
  TypePreviewData
} from "@/types/project";
import {
  INIT_PROJECT,
  SET_PROJECT_BRAND_INFO,
  SET_PROJECT_DESC_INFO,
  SET_PROJECT_PREVIEW_CONF,
  SET_PROJECT_PREVIEW_DATA,
  SET_PROJECT_TEMP_CONF,
  SET_PROJECT_UI_VERSION
} from "@/store/actions";

type TypeInitProject = {
  type: typeof INIT_PROJECT;
};

type TypeSetProjectBrandInfo = {
  type: typeof SET_PROJECT_BRAND_INFO;
  brandInfo: TypeBrandInfo;
};

type TypeSetProjectUiVersion = {
  type: typeof SET_PROJECT_UI_VERSION;
  uiVersion: TypeUiVersionConf;
};

type TypeSetProjectDescInfo = {
  type: typeof SET_PROJECT_DESC_INFO;
  info: TypeProjectInfo;
};

type TypeSetProjectTempConf = {
  type: typeof SET_PROJECT_TEMP_CONF;
  tempConf: TypeTemplateConf;
};

type TypeSetProjectPreviewConf = {
  type: typeof SET_PROJECT_PREVIEW_CONF;
  previewConf: TypePreviewConf;
};

type TypeSetProjectPreviewData = {
  type: typeof SET_PROJECT_PREVIEW_DATA;
  previewData: TypePreviewData;
};

export type TypeActions =
  | TypeInitProject
  | TypeSetProjectBrandInfo
  | TypeSetProjectUiVersion
  | TypeSetProjectDescInfo
  | TypeSetProjectTempConf
  | TypeSetProjectPreviewConf
  | TypeSetProjectPreviewData;

// 初始化工程信息
export function initProject(): TypeInitProject {
  return { type: INIT_PROJECT };
}

// 设置工程厂商信息
export function setProjectBrandInfo(
  brandInfo: TypeBrandInfo
): TypeSetProjectBrandInfo {
  return { type: SET_PROJECT_BRAND_INFO, brandInfo };
}

// 设置 ui 版本信息
export function setProjectUiVersion(
  uiVersion: TypeUiVersionConf
): TypeSetProjectUiVersion {
  return { type: SET_PROJECT_UI_VERSION, uiVersion };
}

// 设置项目描述信息
export function setProjectDescInfo(
  info: TypeProjectInfo
): TypeSetProjectDescInfo {
  return { type: SET_PROJECT_DESC_INFO, info };
}

// 设置模板原始数据
export function setProjectTempConf(
  tempConf: TypeTemplateConf
): TypeSetProjectTempConf {
  return { type: SET_PROJECT_TEMP_CONF, tempConf };
}

// 设置用于预览的配置数据
export function setProjectPreviewConf(
  previewConf: TypePreviewConf
): TypeSetProjectPreviewConf {
  return { type: SET_PROJECT_PREVIEW_CONF, previewConf };
}

// 设置用于预览的数据
export function setProjectPreviewData(
  previewData: TypePreviewData
): TypeSetProjectPreviewData {
  return { type: SET_PROJECT_PREVIEW_DATA, previewData };
}
