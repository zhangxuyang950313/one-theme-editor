import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBrandInfoList,
  setTemplateList
} from "@/store/modules/template/action";
import { initialBrand } from "@/config/editor";
import { getBrandInfo } from "@/store/modules/template/selector";
import { TypeBrandInfo, TypeTemplateConf } from "src/types/project";
import { getBrandList, getTemplateList } from "renderer/api/index";
import errCode from "@/core/error-code";
import { message } from "antd";

// 获取配置的厂商列表
export function useBrandInfoList(): TypeBrandInfo[] {
  const [value, updateValue] = useState<TypeBrandInfo[]>([]);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    getBrandList().then(conf => {
      // 添加默认小米，去重
      const list = [initialBrand, ...conf].reduce<TypeBrandInfo[]>((t, o) => {
        if (!t.some(item => item.templateDir === o.templateDir)) t.push(o);
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
export function useTemplateList(): [TypeTemplateConf[], boolean] {
  const [value, updateValue] = useState<TypeTemplateConf[]>([]);
  const [loading, updateLoading] = useState(true);
  const dispatch = useDispatch();
  const brandInfo = useBrandInfo();
  useLayoutEffect(() => {
    getTemplateList(brandInfo)
      .then(tempConfList => {
        console.log("模板列表：", tempConfList);
        dispatch(setTemplateList(tempConfList));
        updateValue(tempConfList);
        setTimeout(() => {
          updateLoading(false);
        }, 300);
      })
      .catch(err => {
        const content = errCode[3002];
        message.error({ content });
        console.warn(`${content}: ${err}`);
      });
  }, [brandInfo, dispatch]);
  return [value, loading];
}

// 获取预览数据
// export function usePreview
