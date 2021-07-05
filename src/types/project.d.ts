import { projectInfoConfig } from "renderer/config/editor";
// import { TypeSourceConfig } from "./source-config";
import { TypeDatabase } from "./index";

export type TypeBrandInfo = {
  type: string;
  name: string;
};

export type TypeBrandConf = TypeBrandInfo & {
  sourceConfigs: string[];
};

// 版本信息
export type TypeUiVersion = {
  name: string;
  code: string;
};

// 工程描述信息
export type TypeProjectInfo = {
  [k in keyof typeof projectInfoConfig]: string | null;
};

// // 预览页面配置储存数据
// export type TypePageConf = {
//   key: string;
//   md5?: string;
//   conf: TypeTempPageConf | null;
// };

// 创建工程载荷
export type TypeCreateProjectPayload = {
  projectPathname: string;
  sourceConfigUrl: string;
  brandInfo: TypeBrandInfo;
  projectInfo: TypeProjectInfo;
};

// 图片数据
export type TypeImageData = {
  // md5: string;
  width: number;
  height: number;
  size: number;
  filename: string;
  ninePatch: boolean;
};

// 图片映射信息
export type TypeImageMapper = TypeImageData & {
  target: string;
};

export type TypeXmlMapper = {
  content: string;
  target: string;
};

// 打包所有信息
export type TypeProjectData = {
  uuid: string;
  brandInfo: TypeBrandInfo;
  projectPathname: string;
  projectInfo: TypeProjectInfo;
  uiVersion: TypeUiVersion;
  sourceConfigUrl: string;
};

// // 在数据空的图片映射
// export type TypeImageMapperDoc = Omit<TypeImageData, "url">;

// 在数据库中的图片数据
export type TypeImageDataDoc = TypeDatabase<TypeImageData>;

// 在数据库中的工程信息
export type TypeProjectDataDoc = TypeDatabase<TypeProjectData>;
