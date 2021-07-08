import { Express } from "express";
import API from "common/api";
import {
  TypeSourceModuleConf,
  TypeSourcePageData,
  TypeSourceConfig,
  TypeSourceConfigBrief
} from "types/source-config";
import {
  TypeGetValueByKeyPayload,
  TypeReleaseXmlTempPayload,
  TypeResult
} from "types/request";
import { result } from "server/utils/utils";
import { resolveSourcePath } from "server/utils/pathUtils";
import {
  getXmlTempValueByNameAttrVal,
  releaseXmlTemplate
} from "server/file-handler/xml-template";
import PageConfig from "server/compiler/PageConfig";
import SourceConfig from "server/compiler/SourceConfig";

export default function source(service: Express): void {
  /**
   * 获取厂商配置列表
   */
  service.get(API.GET_BRAND_LIST, (request, response) => {
    try {
      const brandConfList = SourceConfig.readBrandConf();
      response.send(result.success(brandConfList));
    } catch (err) {
      response.status(400).send(result.fail(err.message));
    }
  });

  /**
   * 获取配置预览列表
   */
  service.get<{ brandType: string }, TypeResult<TypeSourceConfigBrief[]>>(
    `${API.GET_SOURCE_CONF_LIST}/:brandType`,
    (request, response) => {
      try {
        const { brandType } = request.params;
        if (!brandType) throw new Error("缺少 brandType 参数");
        const list = SourceConfig.getSourceConfigBriefList(brandType);
        response.send(result.success(list));
      } catch (err) {
        response.status(400).send(result.fail(err.message));
      }
    }
  );

  /**
   * 获取模块列表
   */
  service.get<
    never, // reqParams
    TypeResult<TypeSourceModuleConf[]>, // resBody
    never, // reqBody
    { descriptionFile: string } // reqQuery
  >(API.GET_SOURCE_CONF_MODULE_LIST, (request, response) => {
    try {
      const { descriptionFile } = request.query;
      if (!descriptionFile) throw new Error("缺少 descriptionFile 参数");
      const absFile = resolveSourcePath(descriptionFile);
      const data = new SourceConfig(absFile).getModuleList();
      response.send(result.success(data));
    } catch (err) {
      response.status(400).send(result.fail(err.message));
    }
  });

  /**
   * 获取页面信息
   * 传入 pageFile（相对素材的根路径）
   */
  service.get<
    never, // reqParams
    TypeResult<TypeSourcePageData>, // resBody
    never, // reqBody
    { pageFile: string } // reqQuery
  >(API.GET_SOURCE_CONF_PAGE_DATA, async (request, response) => {
    try {
      const { pageFile } = request.query;
      if (!pageFile) throw new Error("缺少 pageFile 参数");
      const absFile = resolveSourcePath(pageFile);
      const data = new PageConfig(absFile).getData();
      response.send(result.success(data));
    } catch (err) {
      response.status(400).send(result.fail(err.message));
    }
  });

  /**
   * 获取配置信息
   * 传入 descriptionFile（相对素材的根路径）
   */
  service.get<
    never, // reqParams
    TypeResult<TypeSourceConfig>, // resBody
    never, // reqBody
    { descriptionFile: string } // reqQuery
  >(API.GET_SOURCE_CONF_DATA, async (request, response) => {
    try {
      const { descriptionFile } = request.query;
      if (!descriptionFile) throw new Error("缺少 descriptionFile 参数");
      const absFile = resolveSourcePath(descriptionFile);
      const data = new SourceConfig(absFile).getConfig();
      response.send(result.success(data));
    } catch (err) {
      response.status(400).send(result.fail(err.message));
    }
  });

  /**
   * 将 key 的 value 写入 xml ${placeholder}
   */
  service.post<
    never, // reqParams
    TypeResult<TypeReleaseXmlTempPayload>, // resBody
    TypeReleaseXmlTempPayload // reqBody
  >(API.OUTPUT_SOURCE_XML_TEMPLATE, async (request, response) => {
    try {
      releaseXmlTemplate(request.body);
      response.send(result.success(request.body));
    } catch (err) {
      response.send(result.fail(err.message));
    }
  });

  /**
   * 获取 xml 模板中 name 的值
   */
  service.get<
    never,
    TypeResult<{ value: string }>,
    never,
    TypeGetValueByKeyPayload
  >(API.GET_SOURCE_VALUE_BY_KEY, async (request, response) => {
    try {
      const { query } = request;
      if (!query.name) throw new Error("缺少 name 参数");
      if (!query.template) throw new Error("缺少 template 参数");
      const value = getXmlTempValueByNameAttrVal(request.query);
      response.send(result.success({ value }));
    } catch (err) {
      response.send(result.fail(err.message));
    }
  });
}
