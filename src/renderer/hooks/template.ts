import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";

import { getBrandConfList, getTempConfList } from "@/api/index";
import ERR_CODE from "@/core/error-code";

import {
  ActionSetBrandInfoList,
  ActionSetSelectedBrand,
  ActionSetCurrentBrand,
  ActionSetCurrentPage
} from "@/store/modules/template/action";
import {
  getSelectedBrand,
  getCurrentModule,
  getCurrentPage,
  getCurrentModuleList,
  getCurrentPageGroupList
} from "@/store/modules/template/selector";

import {
  TypeTempModuleConf,
  TypeTempPageConf,
  TypeTemplateConf,
  TypeTempPageGroupConf
} from "types/template";
import { TypeBrandConf } from "types/project";

// 获取配置的厂商列表
export function useBrandInfoList(): TypeBrandConf[] {
  const [value, updateValue] = useState<TypeBrandConf[]>([]);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    getBrandConfList().then(conf => {
      // 添加默认小米，去重
      const list = conf.reduce<TypeBrandConf[]>((t, o) => {
        if (!t.some(item => item.templateDir === o.templateDir)) t.push(o);
        return t;
      }, []);
      dispatch(ActionSetBrandInfoList(list));
      dispatch(ActionSetSelectedBrand(list[0]));
      updateValue(list);
    });
  }, [dispatch]);
  return value;
}

// 当前选择的厂商信息
export function useSelectedBrand(): TypeBrandConf | null {
  return useSelector(getSelectedBrand);
}

// 获取模板列表
export function useTemplateList(): [TypeTemplateConf[], boolean] {
  const [value, updateValue] = useState<TypeTemplateConf[]>([]);
  const [loading, updateLoading] = useState(true);
  const brandInfo = useSelectedBrand();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (!brandInfo) return;
    getTempConfList(brandInfo)
      .then(tempConfList => {
        console.log("模板列表：", tempConfList);
        updateValue(tempConfList);
        setTimeout(() => {
          updateLoading(false);
        }, 300);
      })
      .catch(err => {
        const content = ERR_CODE[3002];
        message.error({ content });
        console.log(`${content}: ${err}`);
      });
  }, [brandInfo, dispatch]);
  return [value, loading];
}

// 当前模板模块列表
export function useCurrentModuleList(): TypeTempModuleConf[] {
  return useSelector(getCurrentModuleList);
}

// 获取当前选择的模块
export function useCurrentModule(): [
  TypeTempModuleConf | null,
  (data: TypeTempModuleConf) => void
] {
  const dispatch = useDispatch();
  return [
    useSelector(getCurrentModule),
    data => dispatch(ActionSetCurrentBrand(data))
  ];
}

// 当前选择的模块页面组列表
export function useCurrentPageGroupList(): TypeTempPageGroupConf[] {
  return useSelector(getCurrentPageGroupList);
}

// 获取当前选择的页面
export function useCurrentPage(): [
  TypeTempPageConf | null,
  (data: TypeTempPageConf) => void
] {
  const dispatch = useDispatch();
  return [
    useSelector(getCurrentPage),
    data => dispatch(ActionSetCurrentPage(data))
  ];
}
