import { message } from "antd";
import API from "common/api";
import { Express } from "express";
import { TypeResult } from "types/request";
import {
  TypeSCModuleConf,
  TypeSCPageData,
  TypeSourceConfig
} from "types/source-config";
import { result } from "server/core/utils";
import { resolveSourcePath } from "server/core/pathUtils";

import Page from "server/compiler/Page";
import SourceConfig from "server/compiler/SourceConfig";

export default function source(service: Express): void {
  // 获取厂商配置列表
  service.get(API.GET_BRAND_LIST, (request, response) => {
    try {
      const brandConfList = SourceConfig.readBrandConf();
      response.send(result.success(brandConfList));
    } catch (err) {
      response.status(400).send(result.fail(err.message));
    }
  });

  // 获取配置预览列表
  service.get<{ brandType: string }>(
    `${API.GET_SOURCE_DESC_LIST}/:brandType`,
    (request, response) => {
      try {
        const { brandType } = request.params;
        const list = SourceConfig.getDescriptionList(brandType);
        response.send(result.success(list));
      } catch (err) {
        response.status(400).send(result.fail(err.message));
      }
    }
  );

  // 获取模块列表
  service.get<
    never, // reqParams
    TypeResult<TypeSCModuleConf[]>, // resBody
    never, // reqBody
    { descriptionFile: string } // reqQuery
  >(API.GET_SOURCE_MODULE_LIST, (request, response) => {
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

  // 获取页面信息
  service.get<
    never, // reqParams
    TypeResult<TypeSCPageData>, // resBody
    never, // reqBody
    { pageFile: string } // reqQuery
  >(API.GET_SOURCE_PAGE_CONFIG, async (request, response) => {
    try {
      const { pageFile } = request.query;
      if (!pageFile) throw new Error("缺少 pageFile 参数");
      const absFile = resolveSourcePath(pageFile);
      const data = new Page(absFile).getData();
      response.send(result.success(data));
    } catch (err) {
      response.status(400).send(result.fail(err.message));
    }
  });

  // 获取配置信息
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
}
