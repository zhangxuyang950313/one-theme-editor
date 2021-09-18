import { Express } from "express";
import apiConfig from "src/common/apiConf";
import { checkParamsKey, result } from "server/utils/requestUtil";
import { TypeResponseFrame } from "src/types/request";
import { TypeElectronPath, TypePathConfig } from "src/types/extraConfig";
import { swopPathConfig } from "server/services/extra";

export default function extraController(service: Express): void {
  // 交换前后端路径配置
  service.post<never, TypeResponseFrame<TypePathConfig>, TypeElectronPath>(
    apiConfig.SWOP_PATH_CONFIG.path,
    async (request, response) => {
      const electronPaths = request.body;
      checkParamsKey(electronPaths, apiConfig.SWOP_PATH_CONFIG.bodyKeys);
      const pathConfig = await swopPathConfig(electronPaths);
      response.send(result.success(pathConfig));
    }
  );
}
