import { Express } from "express";
import apiConfig from "src/common/apiConf";
import {
  TypeResourceModuleConf,
  TypeResourcePageConf,
  TypeResourceConfig,
  TypeResourceOption,
  TypeScenarioOption
} from "src/types/resource";
import { TypeResponseFrame, UnionTupleToObjectKey } from "src/types/request";
import { checkParamsKey, result } from "server/utils/requestUtil";
import PageConfig from "server/compiler/PageConfig";
import ResourceConfig from "server/compiler/ResourceConfig";
import ScenarioConfig from "server/compiler/ScenarioConfig";
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
   * 获取配置信息列表
   */
  service.get<
    never,
    TypeResponseFrame<TypeResourceOption[], string>,
    never,
    UnionTupleToObjectKey<typeof apiConfig.GET_RESOURCE_CONF_PREVIEW_LIST.query>
  >(`${apiConfig.GET_RESOURCE_CONF_PREVIEW_LIST.path}`, (request, response) => {
    checkParamsKey(
      request.query,
      apiConfig.GET_RESOURCE_CONF_PREVIEW_LIST.query
    );
    const list = ScenarioConfig.from(
      request.query.src
    ).getSourceConfigPreviewList();
    response.send(result.success(list));
  });

  /**
   * 获取模块列表
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypeResourceModuleConf[], string>, // resBody
    never, // reqBody
    UnionTupleToObjectKey<typeof apiConfig.GET_RESOURCE_CONF_MODULE_LIST.query> // reqQuery
  >(apiConfig.GET_RESOURCE_CONF_MODULE_LIST.path, (request, response) => {
    checkParamsKey(
      request.query,
      apiConfig.GET_RESOURCE_CONF_MODULE_LIST.query
    );
    const list = new ResourceConfig(request.query.config).getModuleList();
    response.send(result.success(list));
  });

  /**
   * 获取页面信息
   * 传入 config 文件（相对素材的根路径）
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypeResourcePageConf, string>, // resBody
    never, // reqBody
    UnionTupleToObjectKey<typeof apiConfig.GET_RESOURCE_CONF_PAGE_DATA.query> // reqQuery
  >(apiConfig.GET_RESOURCE_CONF_PAGE_DATA.path, async (request, response) => {
    checkParamsKey(request.query, apiConfig.GET_RESOURCE_CONF_PAGE_DATA.query);
    const { namespace, config } = request.query;
    const data = new PageConfig({ namespace, config }).getData();
    response.send(result.success(data));
  });

  /**
   * 获取配置信息
   * 传入 config 文件（相对素材的根路径）
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypeResourceConfig, string>, // resBody
    never, // reqBody
    UnionTupleToObjectKey<typeof apiConfig.GET_RESOURCE_CONF_DATA.query> // reqQuery
  >(apiConfig.GET_RESOURCE_CONF_DATA.path, async (request, response) => {
    checkParamsKey(request.query, apiConfig.GET_RESOURCE_CONF_DATA.query);
    const data = new ResourceConfig(request.query.config).getConfig();
    response.send(result.success(data));
  });
}
