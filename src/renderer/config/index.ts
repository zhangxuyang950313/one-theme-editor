import fs from "fs";
import path from "path";
// import { TypeBrandInfo } from "@/types/project";
import { templateDir } from "./paths";

// 模板描述文件列表
export const templateDescriptionList = fs.existsSync(templateDir)
  ? fs
      .readdirSync(templateDir)
      .map(dir => path.resolve(templateDir, dir, "description.xml"))
      .filter(fs.existsSync)
  : []; // 排除不存在 description.xml 的目录

// // 品牌配置
// export const brandConfig: TypeBrandInfo[] = [
//   {
//     templateDir: "xm",
//     name: "小米"
//   }
//   // {
//   //   key: "hw",
//   //   name: "华为"
//   // },
//   // {
//   //   key: "oppp",
//   //   name: "oppp"
//   // },
//   // {
//   //   key: "vivo",
//   //   name: "vivo"
//   // }
// ];
