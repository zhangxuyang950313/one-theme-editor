import { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getBrandConfig,
  getTemplateConfigList
} from "@/core/template-compiler";
import {
  setBrandInfoList,
  setTemplateList
} from "@/store/modules/template/action";
import { TypeBrandInfo, TypeTemplateConfig } from "@/types/project";
import { initialBrand } from "@/config/editor";

// 获取配置的厂商列表
export function useBrandInfoList(): TypeBrandInfo[] {
  const [value, updateValue] = useState<TypeBrandInfo[]>([]);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    getBrandConfig().then(conf => {
      // 添加默认小米，去重
      const list = [initialBrand, ...conf].reduce<TypeBrandInfo[]>((t, o) => {
        if (!t.some(({ templateDir }) => templateDir === o.templateDir))
          t.push(o);
        return t;
      }, []);
      dispatch(setBrandInfoList(list));
      updateValue(list);
    });
  }, [dispatch]);
  return value;
}

// 获取模板列表
export function useTemplateList(
  brandInfo: TypeBrandInfo
): TypeTemplateConfig[] {
  const [value, updateValue] = useState<TypeTemplateConfig[]>([]);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    getTemplateConfigList(brandInfo).then(tempConfList => {
      dispatch(setTemplateList(tempConfList));
      updateValue(tempConfList);
    });
  }, [brandInfo, dispatch]);
  return value;
}
