import { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { compileBrandConf, getTempConfList } from "@/core/template-compiler";
import {
  setBrandInfoList,
  setTemplateList
} from "@/store/modules/template/action";
import { TypeBrandInfo, TypeTempConf } from "@/types/project";
import { initialBrand } from "@/config/editor";

// 获取配置的厂商列表
export function useBrandInfoList(): TypeBrandInfo[] {
  const [value, updateValue] = useState<TypeBrandInfo[]>([]);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    compileBrandConf().then(conf => {
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
export function useTemplateList(brandInfo: TypeBrandInfo): TypeTempConf[] {
  const [value, updateValue] = useState<TypeTempConf[]>([]);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    getTempConfList(brandInfo).then(tempConfList => {
      dispatch(setTemplateList(tempConfList));
      updateValue(tempConfList);
    });
  }, [brandInfo, dispatch]);
  return value;
}
