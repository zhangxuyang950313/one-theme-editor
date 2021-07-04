import { ElementCompact } from "xml-js";

type TypeAttrsContent<T> = {
  _attributes: T;
};

type TypeExtendsElementCompact<A, E = { [x: string]: any }> = E &
  ElementCompact & {
    _attributes?: A;
  };

// 模板配置原始信息
export type TypeXMLSourceConf = Partial<{
  description: TypeAttrsContent<Partial<{ name: string; version: string }>>[];
  preview: TypeAttrsContent<Partial<{ src: string }>>[];
  uiVersion: TypeXMLUiVersionConf[];
  module: TypeXMLModuleConf[];
}>;
export type TypeXMLUiVersionConf = TypeAttrsContent<
  Partial<{ name: string; code: string }>
>;
export type TypeXMLModuleConf = TypeAttrsContent<
  Partial<{ name: string; icon: string }>
> &
  Partial<{ group: TypeXMLPageGroupConf[] }>;
export type TypeXMLPageNode = TypeAttrsContent<Partial<{ src: string }>>;
export type TypeXMLPageGroupConf = TypeAttrsContent<
  Partial<{ name: string }>
> & { page?: TypeXMLPageNode[] };

// // 厂商配置原始信息
// export type TypeOriginBrandConf = Partial<{
//   brand: TypeAttrsContent<{
//     name: string;
//     dir: string;
//     type: string;
//   }>[];
// }>;

// 页面配置原始信息
export type TypeXMLSourceLayout = TypeExtendsElementCompact<{
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
export type TypeXMLSourceFrom = TypeExtendsElementCompact<{ src?: string }>;
export type TypeXMLSourceTo = TypeExtendsElementCompact<{ src?: string }>;
export type TypeXMLPageConf = TypeExtendsElementCompact<
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
        layout?: TypeXMLSourceLayout[];
        from?: TypeXMLSourceFrom[];
        to?: TypeXMLSourceTo[];
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