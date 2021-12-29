import fs from "fs";

import path from "path";

import AdmZip from "adm-zip";
// import glob from 'glob';
import dirTree from "directory-tree";
import micromatch from "micromatch";
import { TypePackConfig } from "src/types/config.scenario";

import { PACK_TYPE } from "../enums";

export default class PackageUtil {
  // 匹配文件
  // private static getFilesByPattern(root: string,pattern: string): string[] {
  //   return glob.sync(pattern, { cwd: root, root: root, strict: true });
  // }

  // 读取所有文件地图
  // 不直接读取 buffer，返回 getBuffer 方法，节省内存和时间
  private static getFileMap(root: string) {
    const fileMap: Map<string, { getBuffer: () => Buffer }> = new Map();
    dirTree(root, {}, item => {
      // key 使用绝对路径
      fileMap.set(path.relative(root, item.path), {
        getBuffer: () => fs.readFileSync(item.path)
      });
    });
    return fileMap;
  }

  static pack(root: string, packageConfig: TypePackConfig): AdmZip {
    const zip = new AdmZip();
    const fileMap = PackageUtil.getFileMap(root);

    // 按照配置步骤一依次处理打包逻辑
    packageConfig.steps.forEach(item => {
      // 对当前步骤的目录进行打包处理，如果下一步包含当前步骤的打包产物，则这一步叫做内联打包
      const isPack = item.type === PACK_TYPE.PACK;
      const isCopy = item.type === PACK_TYPE.COPY;

      // 由于每一步操作可能会留下产物，例如 type === "pack" && cache === true
      // 生成最新的文件列表
      const fileList = Array.from(fileMap.keys());

      // 匹配出当前 dir 配置所有匹配的 dir
      // 因为 dir 可能为 patter，例如 com.*。即一条 dir 配置可能对应多个目录
      const dirList = new Set(
        micromatch.match(fileList, path.join(item.dir, "*")).map(path.dirname)
      );

      console.log({ dirList });

      // 对当前步骤多个目录进行打包或拷贝
      dirList.forEach(dir => {
        // 打包要创建一个新的 zip 实例
        const innerZip = new AdmZip();

        // 根据 patter 匹配当前 dir 下所有的文件名
        const files = micromatch.match(
          fileList,
          path.join(dir, item.pattern || "**")
        );

        // 将文件依次压缩进包内，并在文件地图中删除
        files.forEach(file => {
          const f = fileMap.get(file);
          if (!f) return;
          const buff = f.getBuffer();

          // 打包的文件压缩进新的 zip 包中
          if (isPack) {
            innerZip.addFile(path.relative(dir, file), buff);
          } else if (isCopy) {
            // 拷贝的文件直接拷贝到最终的 zip 中
            zip.addFile(file, buff);
          }

          // 打包完删掉缓存
          fileMap.delete(file);
        });

        // 若当前步骤需要打包，则将打包后的数据缓存入地图
        if (isPack) {
          fileMap.set(dir, {
            getBuffer: () => innerZip.toBuffer()
          });
          if (!item.cache) {
            zip.addFile(dir, innerZip.toBuffer());
          }
        }
      });
    });
    return zip;
  }
}

export class Package {
  private root: string;
  private packageConfig: TypePackConfig;
  constructor(root: string, packageConfig: TypePackConfig) {
    this.root = root;
    this.packageConfig = packageConfig;
  }
}

// const ROOT = "./测试text";

// PackageUtil.pack(ROOT, {
//   extname: "mtz",
//   execute9patch: true,
//   steps: [
//     {
//       type: PACK_TYPE.PACK,
//       dir: "clock_2x4"
//     },
//     {
//       type: PACK_TYPE.PACK,
//       dir: "com.*"
//     },
//     {
//       type: PACK_TYPE.PACK,
//       dir: "icons"
//     },
//     {
//       type: PACK_TYPE.PACK,
//       dir: "framework*"
//     },
//     {
//       type: PACK_TYPE.PACK,
//       dir: "lockscreen"
//     },
//     {
//       type: PACK_TYPE.COPY,
//       dir: "wallpaper"
//     },
//     {
//       type: PACK_TYPE.COPY,
//       dir: ".",
//       pattern: "description.xml"
//     }
//   ],
//   excludes: [
//     {
//       regex: "",
//       pattern: ".DS_Store"
//     }
//   ]
// });
