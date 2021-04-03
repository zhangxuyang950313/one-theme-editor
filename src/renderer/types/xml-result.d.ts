// 模板配置原始信息
export type TypeTemplateConfigResult = {
  description?: Array<{ _attributes?: { name?: string; version?: string } }>;
  poster?: Array<{ _attributes?: { src?: string } }>;
  uiVersion?: Array<{ _attributes?: { name?: string; src?: string } }>;
  module?: {
    _attributes?: { name?: string; icon?: string };
    class?: Array<{
      _attributes?: { name?: string };
      page?: Array<{ _attributes?: { src?: string } }>;
    }>;
  }[];
};
