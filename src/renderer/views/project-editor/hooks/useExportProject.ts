import path from "path";

import { message } from "antd";
import { useRecoilValue } from "recoil";

import { projectDataState } from "../store/rescoil/state";

/**
 * 导出工程
 * 1. 压缩 .9
 * 2. 压缩所有文件
 * 3. 输出到指定文件
 *
 * 2、3 步由 window.$one.$server.exportProject 一并处理
 * @returns
 */
export default function useExportProject(): (
  targetPath?: string
) => Promise<string> {
  const {
    projectData, //
    scenarioConfig
  } = useRecoilValue(projectDataState);

  const { packageConfig } = scenarioConfig;

  // 默认路径由 工程根路径的父级 + 工程名称 . 扩展名 组成
  const defaultPath = path.join(
    path.dirname(projectData.root),
    `${projectData.description.name}.${packageConfig.extname}`
  );

  return async (targetPath?: string) => {
    if (packageConfig.steps.length === 0) {
      message.warning("打包步骤为空，请确认");
    }

    console.time("导出总耗时");
    // 默认打包目录为项目根目录
    // 若处理 .9，则 .9 文件会移动到新的临时目录
    // 处理完毕后将剩余文件都移动到临时目录但不覆盖 .9 文件
    const packDir = projectData.root;
    // 处理 .9 到临时目录
    if (packageConfig.execute9patch) {
      console.time("处理.9耗时");
      await window.$one.$server.encode9patchBatch({
        root: projectData.root
      });
      console.timeEnd("处理.9耗时");
      // console.time("拷贝剩余文件耗时");
      // // 拷贝目录，.9 处理过的不覆盖
      // await window.$one.$server.copyFile({
      //   from: projectData.root,
      //   to: packDir,
      //   options: { overwrite: false }
      // });
      // console.timeEnd("拷贝剩余文件耗时");
    }
    // // 导出到文件
    // const outputFile = targetPath || defaultPath;
    // console.time("压缩耗时");
    // await window.$one.$server.exportProject({
    //   packConfig: packageConfig,
    //   packDir,
    //   outputFile
    // });
    // console.timeEnd("压缩耗时");
    console.timeEnd("导出总耗时");

    // await window.$one.$server.deleteFile(packDir);
    // console.log("删除临时目录", packDir);
    // return outputFile;
    return "";
  };
}
