import { projectInfoConfig } from "renderer/config/editor";
import { TypeSourceConfig, TypeTemplateData, TypeUiVersion } from "./template";
import { TypeDatabase } from "./index";

export type TypeBrandInfo = {
  type: string;
  name: string;
};

export type TypeBrandConf = TypeBrandInfo & {
  sourceConfigs: string[];
};

// 工程描述信息
export type TypeProjectDescription = {
  [k in keyof typeof projectInfoConfig]: string | null;
};

// 预览页面配置储存数据
export type TypePageConf = {
  key: string;
  md5?: string;
  conf: TypeTempPageConf | null;
};

export type TypeCreateProjectData = {
  description: TypeProjectDesc;
  uiVersion: TypeUiVersion;
  brandConf: TypeBrandConf;
  configPreview: TypeSourceConfig;
  localPath?: string;
};

// 图片数据
export type TypeImageData = {
  md5: string;
  width: number;
  height: number;
  size: number;
  filename: string;
  ninePatch: boolean;
  base64: string;
};

// 图片信息，不存储 base64 信息
export type TypeImageInfo = Omit<TypeImageData, "base64">;

// 图片映射信息
export type TypeImageMapper = TypeImageInfo & {
  target: string;
};

export type TypeXmlMapper = {
  content: string;
  target: string;
};

// 打包所有信息
export type TypeProjectData = {
  uuid: string;
  brand: TypeBrandInfo;
  description: TypeProjectDescription;
  uiVersion: TypeUiVersion;
  template: TypeTemplateData;
  imageMapperList: TypeImageMapper[];
  xmlMapperList: TypeXmlMapper[];
  localPath: string;
};

// // 在数据空的图片映射
// export type TypeImageMapperDoc = Omit<TypeImageInfo, "url">;

// 在数据库中的图片数据
export type TypeImageDataDoc = TypeDatabase<TypeImageData>;

// 在数据库中的工程信息
export type TypeProjectDataDoc = TypeDatabase<TypeProjectData>;

// 在 redux 缓存中的工程信息， 可能为空值
export type TypeProjectStateInStore = Partial<TypeProjectDataDoc>;
