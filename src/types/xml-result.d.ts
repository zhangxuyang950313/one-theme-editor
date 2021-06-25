import { ElementCompact } from "xml-js";

type TypeAttrsContent<T> = {
  _attributes: T;
};

type TypeExtendsElementCompact<A, E = { [x: string]: any }> = E &
  ElementCompact & {
    _attributes?: A;
  };

// 模板配置原始信息
export type TypeOriginTempConf = Partial<{
  description: TypeAttrsContent<Partial<{ name: string; version: string }>>[];
  preview: TypeAttrsContent<Partial<{ src: string }>>[];
  uiVersion: TypeOriginUiVersionConf[];
  module: TypeOriginTempModuleConf[];
}>;
export type TypeOriginUiVersionConf = TypeAttrsContent<
  Partial<{ name: string; code: string }>
>;
export type TypeOriginTempModuleConf = TypeAttrsContent<
  Partial<{ name: string; icon: string }>
> &
  Partial<{ group: TypeOriginTempPageGroupConf[] }>;
export type TypeOriginTempModulePageConf = TypeAttrsContent<
  Partial<{ src: string }>
>;
export type TypeOriginTempPageGroupConf = TypeAttrsContent<
  Partial<{ name: string }>
> & { page?: TypeOriginTempModulePageConf[] };

// // 厂商配置原始信息
// export type TypeOriginBrandConf = Partial<{
//   brand: TypeAttrsContent<{
//     name: string;
//     dir: string;
//     type: string;
//   }>[];
// }>;

// 页面配置原始信息
export type TypeTempLayout = TypeExtendsElementCompact<{
  x?: string;
  y?: string;
  w?: string;
  h?: string;
  align?: "left" | "center" | "right" | string;
  alignV?: "top" | "center" | "bottom" | string;
  text?: string;
}>;
// Partial<
//   Record<"x" | "y" | "w" | "h", string> & {
//     align: "left" | "center" | "right" | string;
//     alignV: "top" | "center" | "bottom" | string;
//     text: string;
//   }
// >;
export type TypeTempFrom = TypeExtendsElementCompact<{ src?: string }>;
export type TypeTempTo = TypeExtendsElementCompact<{ src?: string }>;
export type TypeTempOriginPageConf = TypeExtendsElementCompact<
  never,
  {
    config?: TypeExtendsElementCompact<{
      version: string;
      description: string;
      screenWidth: string;
    }>[];
    preview?: TypeExtendsElementCompact<{ src?: string }>;
    category?: TypeExtendsElementCompact<{
      tag?: string;
      description?: string;
      type?: "image" | "xml";
    }>[];
    source?: TypeExtendsElementCompact<
      {
        description?: string;
        name?: string;
      },
      {
        layout?: TypeTempLayout[];
        from?: TypeTempFrom[];
        to?: TypeTempTo[];
      }
    >[];
  }
>;
//  Partial<{
//   config?: [
//     TypeAttrsContent<
//       Partial<{
//         version: string;
//         description: string;
//         screenWidth: string;
//       }>
//     >
//   ];
//   preview?: TypeAttrsContent<Partial<{ src: string }>>[];
//   category?: TypeAttrsContent<
//     Partial<{
//       tag: string;
//       description: string;
//       type: "image" | "xml";
//     }>
//   >[];
//   source?: Array<
//     TypeAttrsContent<Partial<{ description: string }>> &
//       Partial<{
//         layout: [TypeAttrsContent<TypeTempLayout>];
//         from: [TypeAttrsContent<TypeTempFrom>];
//         to: TypeAttrsContent<TypeTempTo>[];
//       }>
//   >;
// }>;
