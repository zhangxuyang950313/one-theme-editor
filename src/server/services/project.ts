import path from "path";
import { findProjectByQuery } from "server/dbHandler/project";
import { TypeFileData } from "src/types/resource.page";
import { getFileData } from "src/common/utils/index";
import PageConfigCompiler from "server/compiler/PageConfig";
import PackageUtil from "server/utils/PackageUtil";

/**
 * @deprecated
 * @param uuid
 * @param config
 * @returns
 */
export async function getPageResourceData(
  uuid: string,
  config: string
): Promise<Record<string, TypeFileData>> {
  const { root, resourceSrc } = await findProjectByQuery({ uuid });
  const namespace = path.dirname(resourceSrc);
  const resPathList = new PageConfigCompiler({
    namespace,
    config
  }).getResPathList();
  return resPathList.reduce<Record<string, TypeFileData>>((record, src) => {
    const fileData = getFileData(path.join(root, src));
    record[src] = fileData;
    return record;
  }, {});
}

// 打包工程
export const packProject = PackageUtil.pack;

// 解包工程
export const unpackProject = PackageUtil.unpack;
