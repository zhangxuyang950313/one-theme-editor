import { useEffect, useLayoutEffect, useState } from "react";
import { message } from "antd";
import {
  apiGetBrandConfList,
  apiGetSourceDescriptionList,
  apiGetSourceConfig,
  apiGetSourcePageData
} from "@/api/index";
import { getSourceConfigRoot } from "@/store/global/modules/base/selector";
import {
  ActionSetBrandInfoList,
  ActionSetSourceDescriptionList,
  ActionSetBrandConf
} from "@/store/starter/action";
import { getBrandConf } from "@/store/starter/selector";
import {
  ActionSetCurrentModule,
  ActionSetCurrentPage,
  ActionSetSourceConfig,
  ActionUpdatePageDataMap
} from "@/store/editor/action";
import {
  getSourceModule,
  getSourcePageConf,
  getModuleList,
  getPageGroupList,
  getSourceConfig,
  getSourceTypeList,
  getXmlTemplateList,
  getSourceConfigUrl,
  getSourcePageDataMap
} from "@/store/editor/selector";
import {
  TypeSourceConfig,
  TypeSourceConfigBrief,
  TypeSourcePageGroupConf,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourceTypeConf,
  TypeSourceElement,
  TypeSourceImageElement,
  TypeSourceTextElement,
  TypeSourceXmlTempConf,
  TypeSourcePageData
} from "types/source-config";
import { TypeBrandConf } from "types/project";
import { ELEMENT_TYPES } from "src/enum";
import {
  useStarterDispatch,
  useEditorDispatch,
  useStarterSelector,
  useEditorSelector,
  useGlobalSelector
} from "@/store/index";
import ERR_CODE from "@/core/error-code";
import { useAsyncUpdater } from "./index";

/**
 * 获取当前资源配置数据
 * @returns
 */
export function useSourceConfig(): TypeSourceConfig | null {
  return useEditorSelector(getSourceConfig);
}

/**
 * 获取当前资源配置目录
 * @returns
 */
export function useSourceConfigRoot(): string | null {
  return useGlobalSelector(getSourceConfigRoot);
}

/**
 * 获取当前选择厂商信息
 * @returns
 */
export function useBrandConf(): [
  TypeBrandConf | null,
  (brandConf: TypeBrandConf) => void
] {
  const dispatch = useStarterDispatch();
  return [
    useStarterSelector(getBrandConf),
    brandConf => dispatch(ActionSetBrandConf(brandConf))
  ];
}

/**
 * 获取配置的厂商列表
 * @returns
 */
export function useBrandConfList(): TypeBrandConf[] {
  const [value, updateValue] = useState<TypeBrandConf[]>([]);
  const dispatch = useStarterDispatch();
  const registerUpdater = useAsyncUpdater();
  useLayoutEffect(() => {
    apiGetBrandConfList().then(conf => {
      // 添加默认小米，去重
      const list = conf.reduce<TypeBrandConf[]>((t, o) => {
        if (!t.some(item => item.type === o.type)) t.push(o);
        return t;
      }, []);
      registerUpdater(() => {
        updateValue(list);
        dispatch(ActionSetBrandInfoList(list));
      });
    });
  }, []);
  return value;
}

/**
 * 获取配置预览列表
 * @returns
 */
export function useSourceDescriptionList(): [TypeSourceConfigBrief[], boolean] {
  const [value, updateValue] = useState<TypeSourceConfigBrief[]>([]);
  const [loading, updateLoading] = useState(true);
  const [brandConf] = useBrandConf();
  const dispatchStarter = useStarterDispatch();
  useLayoutEffect(() => {
    if (!brandConf) return;
    apiGetSourceDescriptionList(brandConf.type)
      .then(data => {
        console.log("配置预览列表：", data);
        updateValue(data);
        dispatchStarter(ActionSetSourceDescriptionList(data));
      })
      .catch(err => {
        const content = ERR_CODE[3002];
        message.error({ content });
        console.log(`${content}: ${err}`);
      })
      .finally(() => {
        updateLoading(false);
      });
  }, [brandConf, dispatchStarter]);
  return [value, loading];
}

/**
 * 获取资源配置
 * @returns
 */
export function useLoadSourceConfig(): TypeSourceConfig | null {
  const [value, updateValue] = useState<TypeSourceConfig | null>(null);
  const sourceConfigUrl = useSourceConfigUrl();
  const dispatch = useEditorDispatch();
  useEffect(() => {
    if (!sourceConfigUrl) return;
    apiGetSourceConfig(sourceConfigUrl).then(data => {
      updateValue(data);
      dispatch(ActionSetSourceConfig(data));
    });
  }, [sourceConfigUrl]);
  return value;
}

/**
 * 获取资源配置文件 url
 * @returns
 */
export function useSourceConfigUrl(): string | null {
  return useEditorSelector(getSourceConfigUrl);
}

/**
 * 获取当前配置模块列表
 * @returns
 */
export function useModuleList(): TypeSourceModuleConf[] {
  return useEditorSelector(getModuleList);
}

/**
 * 获取当前选择的模块配置
 * @returns
 */
export function useModuleConf(): [
  TypeSourceModuleConf | null,
  (data: TypeSourceModuleConf) => void
] {
  const dispatch = useEditorDispatch();
  return [
    useEditorSelector(getSourceModule),
    data => dispatch(ActionSetCurrentModule(data))
  ];
}

/**
 * 当前当前模块页面组列表
 */
export function usePageGroupList(): TypeSourcePageGroupConf[] {
  return useEditorSelector(getPageGroupList);
}

/**
 * 获取当前选择的页面
 * @returns
 */
export function usePageConf(): [
  TypeSourcePageConf | null,
  (data: TypeSourcePageConf) => void
] {
  const dispatch = useEditorDispatch();
  return [
    useEditorSelector(getSourcePageConf),
    data => dispatch(ActionSetCurrentPage(data))
  ];
}

/**
 * 获取页面数据
 * @returns
 */
export function usePageConfData(): TypeSourcePageData | null {
  const [value, updateValue] = useState<TypeSourcePageData | null>(null);
  const sourcePageDataMap = useEditorSelector(getSourcePageDataMap);
  const dispatch = useEditorDispatch();
  const pageConf = usePageConf()[0];
  useEffect(() => {
    if (!pageConf?.src) return;
    const pageData = sourcePageDataMap[pageConf.src];
    if (pageData) {
      updateValue(pageData);
      return;
    }
    apiGetSourcePageData(pageConf.src).then(data => {
      updateValue(data);
      dispatch(ActionUpdatePageDataMap(data));
    });
  }, [pageConf?.src]);
  return value;
}

/**
 * 获取当前所有元素列表
 * @returns
 */
export function useSourceElementList(): TypeSourceElement[] {
  const [value, updateValue] = useState<TypeSourceElement[]>([]);
  const pageConfig = usePageConfData();
  useEffect(() => {
    if (!pageConfig?.elementList) return;
    updateValue(pageConfig.elementList);
  }, [pageConfig?.elementList]);
  return value;
}

/**
 * 获取当前元素类型配置
 * @returns
 */
export function useSourceTypeList(): TypeSourceTypeConf[] {
  return useEditorSelector(getSourceTypeList);
}

/**
 * 获取图片类型元素列表
 * @returns
 */
export function useImageSourceList(): TypeSourceImageElement[] {
  const sourceList = useSourceElementList();
  return sourceList.flatMap(item =>
    item.type === ELEMENT_TYPES.IMAGE ? [item] : []
  );
}

/**
 * 获取 xml 类型元素列表
 * @returns
 */
export function useXmlSourceList(): TypeSourceTextElement[] {
  const sourceList = useSourceElementList();
  return sourceList.flatMap(item =>
    item.type === ELEMENT_TYPES.TEXT ? [item] : []
  );
}

/**
 * 获取 xml 模板列表
 * @returns
 */
export function useXmlTemplateList(): TypeSourceXmlTempConf[] {
  return useEditorSelector(getXmlTemplateList);
}
