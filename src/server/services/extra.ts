import pathUtil from "server/utils/pathUtil";
import { updatePathConfig } from "server/dbHandler/extraConfig";
import { TypeElectronPath, TypePathConfig } from "src/types/extraConfig";

// 交换前后端路径数据
// 前端 electron 的路径 + 后端的资源路径等进行合并
export async function swopPathConfig(
  config: TypeElectronPath
): Promise<TypePathConfig> {
  return updatePathConfig({ ...config, ...pathUtil });
}
