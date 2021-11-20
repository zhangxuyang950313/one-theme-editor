import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { TypeModuleConfig, TypePageConfig } from "src/types/config.resource";

import { usePageConfigList } from "../hooks";
import { projectDataState, selectDataState } from "../store/rescoil/state";

import Interface from "@/components/PageSelector";

const pageSelectCache = new WeakMap<TypeModuleConfig, TypePageConfig>();

const PageSelector: React.FC = () => {
  const {
    resourceConfig: { namespace }
  } = useRecoilValue(projectDataState);
  const [
    { moduleSelected, pageSelected }, //
    setSelectData
  ] = useRecoilState(selectDataState);
  const { pageConfigList, fetchPageConfigList } = usePageConfigList(namespace);

  // 读取上次选择的页面数据
  useEffect(() => {
    fetchPageConfigList(moduleSelected).then(moduleList => {
      const [pageConfig] = moduleList;
      if (!pageConfig) {
        pageSelectCache.delete(moduleSelected);
        return;
      }
      const pageSelected = pageSelectCache.get(moduleSelected);
      if (
        pageSelected &&
        moduleList.some(({ config }) => config === pageSelected.config)
      ) {
        setSelectData(state => ({ ...state, pageSelected }));
      } else {
        setSelectData(state => ({ ...state, pageSelected: pageConfig }));
      }
    });
  }, [moduleSelected]);

  useEffect(() => {
    pageSelectCache.set(moduleSelected, pageSelected);
  }, [pageSelected]);

  return (
    <Interface
      pageSelect={pageSelected}
      pageList={pageConfigList}
      onChange={pageSelected => {
        setSelectData(state => ({ ...state, pageSelected }));
      }}
    />
  );
};

export default PageSelector;
