import { Express } from "express";
import API from "common/apiConf";
import { result } from "server/utils/requestUtil";
import { TypeResponseFrame } from "types/request";
import { TypeElectronPath, TypePathConfig } from "types/extraConfig";
import { swopPathConfig } from "server/services/extra";

export default function extraController(service: Express): void {
  // 交换前后端路径配置
  service.post<never, TypeResponseFrame<TypePathConfig>, TypeElectronPath>(
    API.SWOP_PATH_CONFIG.url,
    async (request, response) => {
      const pathConfig = await swopPathConfig(request.body);
      response.send(result.success(pathConfig));
    }
  );
}
