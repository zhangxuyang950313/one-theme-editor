import { Express } from "express";
import API from "common/apiConf";
import {
  TypeSourceModuleConf,
  TypeSourcePageData,
  TypeSourceConfigData,
  TypeSourceConfigInfo
} from "types/source";
import { TypeBrandConf } from "src/types/project";
import { TypeResponseFrame, UnionTupleToObjectKey } from "types/request";
import { checkParamsKey, result } from "server/utils/requestUtil";
import PageConfig from "server/compiler/PageConfig";
import SourceConfig from "server/compiler/SourceConfig";

export default function sourceController(service: Express): void {
  /**
   * 获取厂商配置列表
   */
  service.get<never, TypeResponseFrame<TypeBrandConf[], string>>(
    API.GET_BRAND_LIST.url,
    (request, response) => {
      const brandConfList = SourceConfig.readBrandConf();
      response.send(result.success(brandConfList));
    }
  );

  /**
   * 获取配置信息列表
   */
  service.get<
    UnionTupleToObjectKey<typeof API.GET_SOURCE_CONF_LIST.params>,
    TypeResponseFrame<TypeSourceConfigInfo[], string>
  >(`${API.GET_SOURCE_CONF_LIST.url}/:brandType`, (request, response) => {
    const { brandType } = request.params;
    const list = SourceConfig.getSourceConfigInfoList(brandType);
    response.send(result.success(list));
  });

  /**
   * 获取模块列表
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypeSourceModuleConf[], string>, // resBody
    never, // reqBody
    UnionTupleToObjectKey<typeof API.GET_SOURCE_CONF_MODULE_LIST.query> // reqQuery
  >(API.GET_SOURCE_CONF_MODULE_LIST.url, (request, response) => {
    checkParamsKey(request.query, API.GET_SOURCE_CONF_MODULE_LIST.query);
    const { config } = request.query;
    const data = new SourceConfig(config).getModuleList();
    response.send(result.success(data));
  });

  /**
   * 获取页面信息
   * 传入 config 文件（相对素材的根路径）
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypeSourcePageData, string>, // resBody
    never, // reqBody
    UnionTupleToObjectKey<typeof API.GET_SOURCE_CONF_PAGE_DATA.query> // reqQuery
  >(API.GET_SOURCE_CONF_PAGE_DATA.url, async (request, response) => {
    checkParamsKey(request.query, API.GET_SOURCE_CONF_PAGE_DATA.query);
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
    TypeResponseFrame<TypeSourceConfigData, string>, // resBody
    never, // reqBody
    UnionTupleToObjectKey<typeof API.GET_SOURCE_CONF_DATA.query> // reqQuery
  >(API.GET_SOURCE_CONF_DATA.url, async (request, response) => {
    checkParamsKey(request.query, API.GET_SOURCE_CONF_DATA.query);
    const { config } = request.query;
    const data = new SourceConfig(config).getConfig();
    response.send(result.success(data));
  });
}
