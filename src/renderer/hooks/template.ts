import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compileBrandConf, getTempConfList } from "@/core/TemplateCompiler";
import {
  setBrandInfoList,
  setTemplateList
} from "@/store/modules/template/action";
import { TypeBrandInfo, TypeTemplateConf } from "@/types/project";
import { initialBrand } from "@/config/editor";
import { getBrandInfo } from "@/store/modules/template/selector";

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

// 当前选择的厂商信息
export function useBrandInfo(): TypeBrandInfo {
  return useSelector(getBrandInfo);
}

// 获取模板列表
export function useTemplateList(): TypeTemplateConf[] {
  const [value, updateValue] = useState<TypeTemplateConf[]>([]);
  const dispatch = useDispatch();
  const brandInfo = useBrandInfo();
  useLayoutEffect(() => {
    getTempConfList(brandInfo).then(tempConfList => {
      console.log(tempConfList);
      dispatch(setTemplateList(tempConfList));
      updateValue(tempConfList);
    });
  }, [brandInfo, dispatch]);
  return value;
}

// 获取预览数据
// export function usePreview
