// 品牌信息
export type TypeBrandInfo = {
  key: string;
  name: string;
};

// 模板配置信息
export type TypeUiVersion = {
  name?: string;
  src?: string;
};
export type TypeTemplateConfig = {
  key: string; // 随机键值
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
