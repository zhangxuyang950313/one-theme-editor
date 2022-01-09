import React, { ReactNode, useEffect, useState } from "react";
import { Notification } from "@arco-design/web-react";
import { useRecoilState, useRecoilValue } from "recoil";
import { asyncQueue } from "src/common/utils";
import { PageConfig } from "src/data/ResourceConfig";

import LogUtil from "src/common/utils/LogUtil";

import { projectDataState, selectDataState } from "../store/rescoil/state";

import type {
  TypeModuleConfig,
  TypePageConfig
} from "src/types/config.resource";

import Interface from "@/components/PageSelector";

const pageConfigMap = new Map<string, TypePageConfig>();

const pageSelectCache = new WeakMap<TypeModuleConfig, TypePageConfig>();

// 页面配置列表
export default function usePageSelector(): {
  pageConfigList: TypePageConfig[];
  doFetch: (params: TypeModuleConfig) => Promise<TypePageConfig[]>;
  Content: ReactNode;
} {
  const {
    resourceConfig: { namespace }
  } = useRecoilValue(projectDataState);
  const [
    { moduleSelected, pageSelected }, //
    setSelectData
  ] = useRecoilState(selectDataState);

  // 读取上次选择的页面数据
  useEffect(() => {
    doFetch(moduleSelected).then(([pageConfig]) => {
      setSelectData(state => ({
        ...state,
        pageSelected:
          pageSelectCache.get(moduleSelected) ||
          pageConfig ||
          PageConfig.default
      }));
    });
  }, [moduleSelected]);

  useEffect(() => {
    pageSelectCache.set(moduleSelected, pageSelected);
  }, [pageSelected]);

  const [pageConfigList, setPageConfigList] = useState<TypePageConfig[]>([]);

  const doFetch = async (moduleConfig: TypeModuleConfig) => {
    if (!namespace) return [];
    const queue = moduleConfig.pageList.map(page => async () => {
      // 使用缓存
      const configCache = pageConfigMap.get(page.src);
      if (configCache) {
        LogUtil.cache("pageConfig", page.src);
        return configCache;
      }
      // 服务获取
      const data = await window.$one.$server.getPageConfig({
        namespace,
        config: page.src
      });
      pageConfigMap.set(page.src, data);
      return data;
    });
    const list = await asyncQueue(queue).catch(err => {
      Notification.error({ content: err.message });
    });
    setPageConfigList(list || []);
    return list || [];
  };

  return {
    pageConfigList,
    doFetch,
    Content: (
      <Interface
        pageSelect={pageSelected}
        pageList={pageConfigList}
        onChange={pageSelected => {
          setSelectData(state => ({
            ...state,
            pageSelected
          }));
        }}
      />
    )
  };
}
