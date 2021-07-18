import path from "path";
import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import { message, notification } from "antd";
import {
  apiGetBrandConfList,
  apiGetSourceInfoList,
  apiGetSourceConfig,
  apiGetSourcePageConfData
} from "@/request/index";
import { getSourceConfigDir } from "@/store/global/modules/base/selector";
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
  getSourceConfigUrl,
  getSourceConfig,
  getModuleList,
  getModuleConf,
  getPageGroupList,
  getPageConf,
  getSourceTypeList,
  getSourceElementList,
  getSourceImageList,
  getSourceTextList,
  getSourceDefineList
} from "@/store/editor/selector";
import {
  TypeSourceConfigData,
  TypeSourceConfigInfo,
  TypeSourcePageGroupConf,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourceTypeConf,
  TypeSourceLayoutElement,
  TypeSourceImageElement,
  TypeSourceTextElement,
  TypeSourcePageData,
  TypeSourceDefine
} from "types/source-config";
import { TypeBrandConf } from "types/project";
import {
  useStarterDispatch,
  useEditorDispatch,
  useStarterSelector,
  useEditorSelector,
  useGlobalSelector
} from "@/store/index";
import ERR_CODE from "common/errorCode";
import { asyncQueue } from "common/utils";
import { useAsyncUpdater } from "./index";

/**
 * 获取当前资源配置数据
 * @returns
 */
export function useSourceConfig(): TypeSourceConfigData {
  return useEditorSelector(getSourceConfig);
}

/**
 * 获取当前资源配置目录
 * @returns
 */
export function useSourceConfigRoot(): string {
  const sourceConfigUrl = useSourceConfigUrl();
  const sourceConfigDir = useGlobalSelector(getSourceConfigDir);
  return path.join(sourceConfigDir, path.dirname(sourceConfigUrl));
}

/**
 * 获取当前选择厂商信息
 * @returns
 */
export function useBrandConf(): [
  TypeBrandConf,
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
export function useSourceDescriptionList(): [TypeSourceConfigInfo[], boolean] {
  const [value, updateValue] = useState<TypeSourceConfigInfo[]>([]);
  const [loading, updateLoading] = useState(true);
  const [brandConf] = useBrandConf();
  const dispatch = useStarterDispatch();
  useLayoutEffect(() => {
    if (!brandConf.type) return;
    apiGetSourceInfoList(brandConf.type)
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

/**
 * 获取资源配置
 * @returns
 */
export function useFetchSourceConfig(): [
  TypeSourceConfigData,
  boolean,
  () => Promise<void>
] {
  const [loading, updateLoading] = useState(true);
  const dispatch = useEditorDispatch();
  const sourceConfigUrl = useSourceConfigUrl();
  const sourceConfig = useSourceConfig();
  const doFetchData = useCallback(async () => {
    if (!sourceConfigUrl) return;
    updateLoading(true);
    const data = await apiGetSourceConfig(sourceConfigUrl);
    if (!data) throw new Error(ERR_CODE[3002]);
    console.log(`加载资源配置: ${sourceConfigUrl}`, data);
    dispatch(ActionSetSourceConfig(data));
    updateLoading(false);
  }, [sourceConfigUrl]);
  useEffect(() => {
    doFetchData().catch(err => {
      notification.error({ message: err.message });
    });
  }, [sourceConfigUrl]);
  return [sourceConfig, loading, doFetchData];
}

/**
 * 获取资源配置文件 url
 * @returns
 */
export function useSourceConfigUrl(): string {
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
  TypeSourceModuleConf,
  (data: TypeSourceModuleConf) => void
] {
  const dispatch = useEditorDispatch();
  return [
    useEditorSelector(getModuleConf),
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
  TypeSourcePageConf,
  (data: TypeSourcePageConf) => void
] {
  const dispatch = useEditorDispatch();
  return [
    useEditorSelector(getPageConf),
    data => dispatch(ActionSetCurrentPage(data))
  ];
}

/**
 * 获取页面数据
 * @returns
 */
export function useFetchPageConfData1(): [
  TypeSourcePageData | null,
  boolean,
  () => Promise<void>
] {
  const [loading, updateLoading] = useState(true);
  const [value, updateValue] = useState<TypeSourcePageData | null>(null);
  const dispatch = useEditorDispatch();
  const pageConf = usePageConf()[0];
  const sourceConfigUrl = useSourceConfigUrl();
  const fetchData = async () => {
    if (!pageConf?.src) return;
    updateLoading(true);
    const data = await apiGetSourcePageConfData({
      namespace: path.dirname(sourceConfigUrl),
      config: pageConf.src
    });
    updateValue(data);
    dispatch(ActionUpdatePageDataMap(data));
    updateLoading(false);
  };
  useEffect(() => {
    fetchData().catch(err => {
      updateValue(null);
      notification.error({ message: err.message });
    });
  }, [pageConf?.src]);
  return [value, loading, fetchData];
}

/**
 * 获取页面数据
 * @returns
 */
export function useFetchPageConfData(): [TypeSourcePageData[], boolean] {
  const [loading, updateLoading] = useState(true);
  const [value, updateValue] = useState<TypeSourcePageData[]>([]);
  const dispatch = useEditorDispatch();
  const pageGroupList = usePageGroupList();
  const sourceConfigUrl = useSourceConfigUrl();

  useEffect(() => {
    const pageConfDataQueue = pageGroupList
      .flatMap(item => item.pageList)
      .map(item => async () => {
        const data = await apiGetSourcePageConfData({
          namespace: path.dirname(sourceConfigUrl),
          config: item.src
        });
        dispatch(ActionUpdatePageDataMap(data));
        return data;
      });
    updateLoading(true);
    asyncQueue(pageConfDataQueue)
      .then(data => updateValue(data))
      .catch(err => notification.error({ message: err.message }))
      .finally(() => updateLoading(false));
  }, [pageGroupList]);
  return [value, loading];
}

/**
 * 获取当前元素类型配置
 * @returns
 */
export function useSourceTypeList(): TypeSourceTypeConf[] {
  return useEditorSelector(getSourceTypeList);
}

/**
 * 获取当前所有元素列表
 * @returns
 */
export function useSourceElementList(): TypeSourceLayoutElement[] {
  return useEditorSelector(getSourceElementList);
}

/**
 * 获取图片类型元素列表
 * @returns
 */
export function useImageSourceList(): TypeSourceImageElement[] {
  return useEditorSelector(getSourceImageList);
}

/**
 * 获取 xml 类型元素列表
 * @returns
 */
export function useTextSourceList(): TypeSourceTextElement[] {
  return useEditorSelector(getSourceTextList);
}

/**
 * 获取 xml 模板列表
 * @returns
 */
export function useSourceDefineList(): TypeSourceDefine[] {
  return useEditorSelector(getSourceDefineList);
}
