import { Express } from "express";
import apiConfig from "src/constant/apiConf";
import {
  TypeModuleConfig,
  TypePageConfig,
  TypeResourceConfig,
  TypeResourceOption
} from "src/types/resource.config";
import {
  TypeScenarioOption,
  TypeScenarioConfig
} from "src/types/scenario.config";
import { TypeResponseFrame, UnionTupleToObjectKey } from "src/types/request";
import { checkParamsKey, result } from "server/utils/requestUtil";
import PageConfigCompiler from "server/compiler/PageConfig";
import ResourceConfigCompiler from "server/compiler/ResourceConfig";
import ScenarioConfigCompiler from "server/compiler/ScenarioConfig";
import ScenarioOptions from "server/compiler/ScenarioOptions";

export default function sourceController(service: Express): void {
  /**
   * 获取场景配置列表
   */
  service.get<never, TypeResponseFrame<TypeScenarioOption[], string>>(
    apiConfig.GET_SCENARIO_OPTION_LIST.path,
    (request, response) => {
      const optionList = ScenarioOptions.readScenarioOptionList();
      response.send(result.success(optionList));
    }
  );

  /**
   * 获取场景配置数据
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypeScenarioConfig, string>, // resBody
    never, // reqBody
    UnionTupleToObjectKey<typeof apiConfig.GET_SCENARIO_CONFIG.query>
  >(apiConfig.GET_SCENARIO_CONFIG.path, (request, response) => {
    const scenarioConfig = ScenarioConfigCompiler.from(
      request.query.config
    ).getConfig();
    response.send(result.success(scenarioConfig));
  });

  /**
   * 获取配置信息列表
   */
  service.get<
    never,
    TypeResponseFrame<TypeResourceOption[], string>,
    never,
    UnionTupleToObjectKey<
      typeof apiConfig.GET_RESOURCE_CONFIG_PREVIEW_LIST.query
    >
  >(
    `${apiConfig.GET_RESOURCE_CONFIG_PREVIEW_LIST.path}`,
    (request, response) => {
      checkParamsKey(
        request.query,
        apiConfig.GET_RESOURCE_CONFIG_PREVIEW_LIST.query
      );
      const list = ScenarioConfigCompiler.from(
        request.query.src
      ).getResourceOptionList();
      response.send(result.success(list));
    }
  );

  /**
   * 获取模块列表
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypeModuleConfig[], string>, // resBody
    never, // reqBody
    UnionTupleToObjectKey<
      typeof apiConfig.GET_RESOURCE_CONFIG_MODULE_LIST.query
    > // reqQuery
  >(apiConfig.GET_RESOURCE_CONFIG_MODULE_LIST.path, (request, response) => {
    checkParamsKey(
      request.query,
      apiConfig.GET_RESOURCE_CONFIG_MODULE_LIST.query
    );
    const list = ResourceConfigCompiler.from(
      request.query.config
    ).getModuleList();
    response.send(result.success(list));
  });

  /**
   * 获取页面信息
   * 传入 config 文件（相对素材的根路径）
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypePageConfig, string>, // resBody
    never, // reqBody
    UnionTupleToObjectKey<
      typeof apiConfig.GET_RESOURCE_CONFIG_PAGE_CONFIG.query
    > // reqQuery
  >(
    apiConfig.GET_RESOURCE_CONFIG_PAGE_CONFIG.path,
    async (request, response) => {
      checkParamsKey(
        request.query,
        apiConfig.GET_RESOURCE_CONFIG_PAGE_CONFIG.query
      );
      const { namespace, config } = request.query;
      const data = new PageConfigCompiler({ namespace, config }).getData();
      response.send(result.success(data));
    }
  );

  /**
   * 获取配置信息
   * 传入 config 文件（相对素材的根路径）
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypeResourceConfig, string>, // resBody
    never, // reqBody
    UnionTupleToObjectKey<typeof apiConfig.GET_RESOURCE_CONFIG.query> // reqQuery
  >(apiConfig.GET_RESOURCE_CONFIG.path, async (request, response) => {
    checkParamsKey(request.query, apiConfig.GET_RESOURCE_CONFIG.query);
    const data = new ResourceConfigCompiler(request.query.config).getConfig();
    response.send(result.success(data));
  });
}
