type TypeAttrsContent<T> = {
  _attributes: T;
};

// 模板配置原始信息
export type TypeTemplateConfigResult = {
  description?: TypeAttrsContent<{ name?: string; version?: string }>[];
  poster?: TypeAttrsContent<{ src?: string }>[];
  uiVersion?: TypeAttrsContent<{ name?: string; src?: string }>[];
  module?: Array<
    TypeAttrsContent<{ name?: string; icon?: string }> & {
      class?: Array<
        TypeAttrsContent<{ name?: string }> & {
          page?: TypeAttrsContent<{ src?: string }>[];
        }
      >;
    }
  >;
};

// 厂商配置原始信息
export type TypeBrandConfigResult = {
  brand: TypeAttrsContent<{
    name: string;
    templateDir: string;
  }>[];
};
