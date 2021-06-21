import { projectInfoConfig } from "renderer/config/editor";
import { TypeTemplateData } from "./template";
import { TypeDatabase } from "./index";

export type TypeBrandInfo = {
  type: string;
  name: string;
};

export type TypeBrandConf = TypeBrandInfo & {
  templateDir: string;
};

// 工程描述信息
export type TypeProjectDescription = {
  [k in keyof typeof projectInfoConfig]: string | null;
};

export type TypeUiVersionInfo = {
  name: string;
  code: string;
};

// 预览页面配置储存数据
export type TypePageConf = {
  key: string;
  md5?: string;
  conf: TypeTempPageConf | null;
};

export type TypeCreateProjectData = {
  description: TypeProjectDesc;
  uiVersionConf: TypeUiVersionConf;
  brandConf: TypeBrandConf;
  templateConf: TypeTemplateConf;
  localPath?: string;
};

// 图片数据
export type TypeImageData = {
  md5: string;
  base64: string | null;
};

// 图片相关信息及访问 url
export type TypeImageInfo = {
  url: string | null;
  md5: string | null;
  width: number;
  height: number;
  size: number;
  filename: string | null;
  ninePatch: boolean;
};

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
  uiVersion: TypeUiVersionInfo;
  template: TypeTemplateData;
  imageMapperList: TypeImageMapper[];
  xmlMapperList: TypeXmlMapper[];
  localPath: string | null;
};

// 在数据库中的图片数据
export type TypeImageDataDoc = TypeDatabase<TypeImageData>;

// 在数据库中的工程信息
export type TypeProjectDataDoc = TypeDatabase<TypeProjectData>;

// 在 redux 缓存中的工程信息， 可能为空值
export type TypeProjectStateInStore = Partial<TypeProjectDataDoc>;
