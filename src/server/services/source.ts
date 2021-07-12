import { Express } from "express";
import API from "common/api";
import {
  TypeSourceModuleConf,
  TypeSourcePageData,
  TypeSourceConfigData,
  TypeSourceConfigInfo
} from "types/source-config";
import { TypeResponseFrame } from "types/request";
import { result } from "server/utils/utils";
import { resolveSourcePath } from "server/utils/pathUtils";
import PageConfig from "server/compiler/PageConfig";
import SourceConfig from "server/compiler/SourceConfig";

export default function source(service: Express): void {
  /**
   * 获取厂商配置列表
   */
  service.get(API.GET_BRAND_LIST, (request, response) => {
    const brandConfList = SourceConfig.readBrandConf();
    response.send(result.success(brandConfList));
  });

  /**
   * 获取配置预览列表
   */
  service.get<
    { brandType: string },
    TypeResponseFrame<TypeSourceConfigInfo[], string>
  >(`${API.GET_SOURCE_CONF_LIST}/:brandType`, (request, response) => {
    const { brandType } = request.params;
    if (!brandType) throw new Error("缺少 brandType 参数");
    const list = SourceConfig.getSourceConfigBriefList(brandType);
    response.send(result.success(list));
  });

  /**
   * 获取模块列表
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypeSourceModuleConf[], string>, // resBody
    never, // reqBody
    { descriptionFile: string } // reqQuery
  >(API.GET_SOURCE_CONF_MODULE_LIST, (request, response) => {
    const { descriptionFile } = request.query;
    if (!descriptionFile) throw new Error("缺少 descriptionFile 参数");
    const absFile = resolveSourcePath(descriptionFile);
    const data = new SourceConfig(absFile).getModuleList();
    response.send(result.success(data));
  });

  /**
   * 获取页面信息
   * 传入 pageFile（相对素材的根路径）
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypeSourcePageData, string>, // resBody
    never, // reqBody
    { pageFile: string } // reqQuery
  >(API.GET_SOURCE_CONF_PAGE_DATA, async (request, response) => {
    const { pageFile } = request.query;
    if (!pageFile) throw new Error("缺少 pageFile 参数");
    const absFile = resolveSourcePath(pageFile);
    const data = new PageConfig(absFile).getData();
    response.send(result.success(data));
  });

  /**
   * 获取配置信息
   * 传入 descriptionFile（相对素材的根路径）
   */
  service.get<
    never, // reqParams
    TypeResponseFrame<TypeSourceConfigData, string>, // resBody
    never, // reqBody
    { descriptionFile: string } // reqQuery
  >(API.GET_SOURCE_CONF_DATA, async (request, response) => {
    const { descriptionFile } = request.query;
    if (!descriptionFile) throw new Error("缺少 descriptionFile 参数");
    const absFile = resolveSourcePath(descriptionFile);
    const data = new SourceConfig(absFile).getConfig();
    response.send(result.success(data));
  });
}
