import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBrandInfoList,
  setTemplateList
} from "@/store/modules/template/action";
import { getBrandInfo } from "@/store/modules/template/selector";
import { TypeBrandConf, TypeTemplateConf } from "src/types/project";
import { getBrandConfList, getTempConfList } from "@/api/index";
import { initialBrand } from "@/config/editor";
import errCode from "@/core/error-code";
import { message } from "antd";

// 获取配置的厂商列表
export function useBrandInfoList(): TypeBrandConf[] {
  const [value, updateValue] = useState<TypeBrandConf[]>([]);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    getBrandConfList().then(conf => {
      // 添加默认小米，去重
      const list = [initialBrand, ...conf].reduce<TypeBrandConf[]>((t, o) => {
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
export function useBrandConf(): TypeBrandConf {
  return useSelector(getBrandInfo);
}

// 获取模板列表
export function useTemplateList(): [TypeTemplateConf[], boolean] {
  const [value, updateValue] = useState<TypeTemplateConf[]>([]);
  const [loading, updateLoading] = useState(true);
  const dispatch = useDispatch();
  const brandInfo = useBrandConf();
  useLayoutEffect(() => {
    getTempConfList(brandInfo)
      .then(tempConfList => {
        console.log("模板列表：", tempConfList);
        // dispatch(setTemplateList(tempConfList));
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
