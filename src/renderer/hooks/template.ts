import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";

import { getBrandConfList, getTempConfList } from "@/api/index";
import ERR_CODE from "@/core/error-code";

import {
  setBrandInfoList,
  setSelectedBrand,
  setCurrentBrand,
  setCurrentPage
} from "@/store/modules/template/action";
import {
  getSelectedBrand,
  getSelectedModule,
  getSelectedPage
} from "@/store/modules/template/selector";

import {
  TypeTempModuleConf,
  TypeTempPageConf,
  TypeTemplateConf
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
      dispatch(setBrandInfoList(list));
      dispatch(setSelectedBrand(list[0]));
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

// 获取预览数据
// export function usePreview

// 获取当前选择的模块
export function useSelectedModule(): [
  TypeTempModuleConf | null,
  (data: TypeTempModuleConf) => void
] {
  const dispatch = useDispatch();
  return [
    useSelector(getSelectedModule),
    data => dispatch(setCurrentBrand(data))
  ];
}

// 获取当前选择的页面
export function useSelectedPage(): [
  TypeTempPageConf | null,
  (data: TypeTempPageConf) => void
] {
  const dispatch = useDispatch();
  return [useSelector(getSelectedPage), data => dispatch(setCurrentPage(data))];
}
