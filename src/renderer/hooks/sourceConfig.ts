import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { message } from "antd";

import {
  apiGetSourceConfigList,
  apiGetBrandConfList,
  apiGetSourceDescriptionList
} from "@/api/index";

import {
  ActionSetBrandInfoList,
  ActionSetSelectedBrand,
  ActionSetCurrentBrand,
  ActionSetCurrentPage,
  ActionSetSourceDescriptionList
} from "@/store/modules/source-config/action";
import {
  getSelectedBrandConf,
  getCurrentModule,
  getCurrentPage,
  getCurrentModuleList,
  getCurrentPageGroupList
} from "@/store/modules/source-config/selector";

import {
  TypeSourceConfig,
  TypeSourceDescription,
  TypeSourcePageGroupConf,
  TypeSourceModuleConf,
  TypeSourcePageConf
} from "types/source-config";
import { TypeBrandConf } from "types/project";

import ERR_CODE from "@/core/error-code";
import { useAsyncUpdater } from "./index";

// 获取配置的厂商列表
export function useBrandConfList(): TypeBrandConf[] {
  const [value, updateValue] = useState<TypeBrandConf[]>([]);
  const dispatch = useDispatch();
  const registerUpdater = useAsyncUpdater();
  useLayoutEffect(() => {
    apiGetBrandConfList().then(conf => {
      // 添加默认小米，去重
      const list = conf.reduce<TypeBrandConf[]>((t, o) => {
        if (!t.some(item => item.type === o.type)) t.push(o);
        return t;
      }, []);
      registerUpdater(() => {
        dispatch(ActionSetBrandInfoList(list));
        dispatch(ActionSetSelectedBrand(list[0]));
        updateValue(list);
      });
    });
  }, [dispatch]);
  return value;
}

// 当前选择的厂商信息
export function useSelectedBrandConf(): TypeBrandConf | null {
  return useSelector(getSelectedBrandConf);
}

// 获取配置预览列表
export function useSourceDescriptionList(): [TypeSourceDescription[], boolean] {
  const [value, updateValue] = useState<TypeSourceDescription[]>([]);
  const [loading, updateLoading] = useState(true);
  const brandConf = useSelectedBrandConf();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (!brandConf) return;
    apiGetSourceDescriptionList(brandConf.type)
      .then(data => {
        console.log("配置预览列表：", data);
        updateValue(data);
        dispatch(ActionSetSourceDescriptionList(data));
      })
      .catch(err => {
        const content = ERR_CODE[3002];
        message.error({ content });
        console.log(`${content}: ${err}`);
      })
      .finally(() => {
        updateLoading(false);
      });
  }, [brandConf, dispatch]);
  return [value, loading];
}

// 获取配置列表
export function useSourceConfigList(): [TypeSourceConfig[], boolean] {
  const [value, updateValue] = useState<TypeSourceConfig[]>([]);
  const [loading, updateLoading] = useState(true);
  const brandConf = useSelectedBrandConf();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (!brandConf) return;
    apiGetSourceConfigList(brandConf.type)
      .then(data => {
        console.log("配置列表", data);
        updateValue(data);
      })
      .catch(err => {
        const content = ERR_CODE[3002];
        message.error({ content });
        console.log(`${content}: ${err}`);
      })
      .finally(() => {
        updateLoading(false);
      });
  }, [brandConf, dispatch]);
  return [value, loading];
}

// 当前模板模块列表
export function useCurrentModuleList(): TypeSourceModuleConf[] {
  return useSelector(getCurrentModuleList);
}

// 获取当前选择的模块
export function useCurrentModule(): [
  TypeSourceModuleConf | null,
  (data: TypeSourceModuleConf) => void
] {
  const dispatch = useDispatch();
  return [
    useSelector(getCurrentModule),
    data => dispatch(ActionSetCurrentBrand(data))
  ];
}

// 当前选择的模块页面组列表
export function useCurrentPageGroupList(): TypeSourcePageGroupConf[] {
  return useSelector(getCurrentPageGroupList);
}

// 获取当前选择的页面
export function useCurrentPage(): [
  TypeSourcePageConf | null,
  (data: TypeSourcePageConf) => void
] {
  const dispatch = useDispatch();
  return [
    useSelector(getCurrentPage),
    data => dispatch(ActionSetCurrentPage(data))
  ];
}
