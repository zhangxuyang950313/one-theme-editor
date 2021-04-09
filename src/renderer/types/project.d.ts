import { projectInfoConfig } from "@/config/editor";

// 品牌信息
export type TypeBrandInfo = {
  templateDir: string;
  name: string;
};

// 模板配置信息
export type TypeUiVersion = {
  name?: string;
  src?: string;
};
export type TypeTemplateConfig = {
  key: string; // 随机键值
  root: string; // 根目录
  // brandInfo?: TypeBrandInfo;
  name?: string; // 模板名称
  poster?: string; // 模板缩略图
  version?: string; //
  uiVersions?: Array<TypeUiVersion>; // 系统 UI 版本
  modules?: Array<{
    name?: string; // 模块名称
    icon?: string; // 模块图标，用于侧边栏显示
    // 预览图类型
    previewClass?: Array<{
      name?: string;
      // 页面配置
      pages?: string[];
    }>;
  }>;
};

// 项目描述信息
export type TypeProjectInfo = {
  [k in keyof typeof projectInfoConfig]: string;
};

// 储存在数据库的项目数据
export type TypeProjectData = {
  brandInfo: TypeBrandInfo;
  projectInfo: TypeProjectInfo;
  templateConfig: TypeTemplateConfig;
  projectResource: any;
};

// 从数据库取出的项目文档数据
export type TypeDatabase<T = { [x: string]: any }> = T & {
  _id: string;
  createAt?: Date;
  updateAt?: Date;
};
