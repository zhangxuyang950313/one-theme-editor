// import path from "path";
// import fse from "fs-extra";
// import _ from "lodash";
// import {
//   TypeBrandConf,
//   TypeTempPageConf,
//   TypeTemplateConf
// } from "../types/project";
// import {
//   TypeOriginTempConf,
//   TypeOriginBrandConf,
//   TypeTempOriginPageConf
// } from "../types/xml-result";
// import errCode from "../renderer/core/error-code";
// import { getTempDirByBrand, TEMPLATE_CONFIG } from "./paths";
// import { xml2jsonCompact } from "./xmlCompiler";
// import { getRandomStr } from "./utils";

// // 解析单个预览页面配置
// export async function compilePageConf(file: string): Promise<TypeTempPageConf> {
//   if (!fse.existsSync(file)) {
//     return Promise.reject(new Error(errCode[3000]));
//   }
//   const data = await xml2jsonCompact<TypeTempOriginPageConf>(file);
//   return {
//     root: path.dirname(file),
//     config: {
//       version: data.config?.[0]._attributes.version || "",
//       description: data.config?.[0]._attributes.description || "",
//       screenWidth: data.config?.[0]._attributes.screenWidth || ""
//     },
//     cover: data.cover?.[0]._attributes.src || "",
//     category:
//       data.category?.map(item => ({
//         tag: item._attributes.tag || "",
//         description: item._attributes.description || "",
//         type: item._attributes.type || null
//       })) || [],
//     source:
//       data.source?.map(item => ({
//         description: item._attributes.description || "",
//         layout: item.layout?.[0]._attributes || {},
//         from: item.from?.[0]._attributes.src || "",
//         to: item.to?.map(item => item._attributes.src) || []
//       })) || [],
//     xml: []
//   };
// }
