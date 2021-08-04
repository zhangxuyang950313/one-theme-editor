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
  ActionPatchPageDataMap
} from "@/store/editor/action";
import {
  selectSourceConfigUrl,
  selectSourceConfig,
  selectSourceModuleList,
  selectSourceModuleConf,
  selectSourcePageGroupList,
  selectSourcePageConf,
  selectSourceTypeList,
  selectLayoutSourceList,
  selectLayoutImageList,
  selectLayoutTextList,
  selectSourceDefineList,
  selectSourcePageData
} from "@/store/editor/selector";
import {
  TypeSourceConfigData,
  TypeSourceConfigInfo,
  TypeSourcePageGroupConf,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourceTypeConf,
  TypeLayoutElement,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeSourcePageData,
  TypeSourceDefine,
  TypeSourceDefineImage,
  TypeSourceDefineValue
} from "types/source";
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
import { SOURCE_TYPES } from "enum/index";
import { useImagePrefix } from "./image";
import { useAsyncUpdater } from "./index";

/**
 * 获取当前资源配置数据
 * @returns
 */
export function useSourceConfig(): TypeSourceConfigData {
  return useEditorSelector(selectSourceConfig);
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
  const brandConf = useStarterSelector(getBrandConf);
  return [brandConf, brandConf => dispatch(ActionSetBrandConf(brandConf))];
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
  return useEditorSelector(selectSourceConfigUrl);
}

/**
 * 获取当前配置模块列表
 * @returns
 */
export function useSourceModuleList(): TypeSourceModuleConf[] {
  return useEditorSelector(selectSourceModuleList);
}

/**
 * 获取当前选择的模块配置
 * @returns
 */
export function useSourceModuleConf(): [
  TypeSourceModuleConf,
  (data: TypeSourceModuleConf) => void
] {
  const dispatch = useEditorDispatch();
  const moduleConf = useEditorSelector(selectSourceModuleConf);
  return [moduleConf, data => dispatch(ActionSetCurrentModule(data))];
}

/**
 * 当前当前模块页面组列表
 */
export function useSourcePageGroupList(): TypeSourcePageGroupConf[] {
  return useEditorSelector(selectSourcePageGroupList);
}

/**
 * 获取当前选择的页面配置
 * @returns
 */
export function useSourcePageConf(): [
  TypeSourcePageConf,
  (data: TypeSourcePageConf) => void
] {
  const dispatch = useEditorDispatch();
  const pageConf = useEditorSelector(selectSourcePageConf);
  return [pageConf, data => dispatch(ActionSetCurrentPage(data))];
}

export function useSourcePageData(): TypeSourcePageData | null {
  return useEditorSelector(selectSourcePageData);
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
  const pageConf = useSourcePageConf()[0];
  const sourceConfigUrl = useSourceConfigUrl();
  const fetchData = async () => {
    if (!pageConf?.src) return;
    updateLoading(true);
    const data = await apiGetSourcePageConfData({
      namespace: path.dirname(sourceConfigUrl),
      config: pageConf.src
    });
    updateValue(data);
    dispatch(ActionPatchPageDataMap(data));
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
  const pageGroupList = useSourcePageGroupList();
  const sourceConfigUrl = useSourceConfigUrl();

  useEffect(() => {
    const pageConfDataQueue = pageGroupList
      .flatMap(item => item.pageList)
      .map(item => async () => {
        const data = await apiGetSourcePageConfData({
          namespace: path.dirname(sourceConfigUrl),
          config: item.src
        });
        dispatch(ActionPatchPageDataMap(data));
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
 */
export function useSourceTypeList(): TypeSourceTypeConf[] {
  return useEditorSelector(selectSourceTypeList);
}

/**
 * 获取素材定义数据列表
 */
export function useSourceDefineList(): TypeSourceDefine[] {
  return useEditorSelector(selectSourceDefineList);
}

/**
 * 所有类型素材定义 map tag -> list
 * @deprecated
 */
export function useSourceDefineMap(): Map<string, TypeSourceDefine[]> {
  const sourceDefineList = useSourceDefineList();
  return sourceDefineList.reduce<Map<string, TypeSourceDefine[]>>((t, o) => {
    t.set(o.tagName, [...(t.get(o.tagName) || []), o]);
    return t;
  }, new Map());
}

/**
 * 值类型素材定义 map tag -> list
 * @deprecated
 */
export function useSourceDefineValueMap(): Map<
  string,
  TypeSourceDefineValue[]
> {
  const XML_VALUE_TYPE = new Set([
    SOURCE_TYPES.COLOR,
    SOURCE_TYPES.BOOLEAN,
    SOURCE_TYPES.STRING,
    SOURCE_TYPES.NUMBER
  ]);
  const sourceTypeList = useSourceTypeList();
  const sourceDefineList = useSourceDefineList();
  const valueSourceTags = sourceTypeList
    .filter(item => XML_VALUE_TYPE.has(item.type))
    .map(item => item.tag);
  return sourceDefineList.reduce((t, o) => {
    if (valueSourceTags.includes(o.tagName)) {
      t.set(o.tagName, [...(t.get(o.tagName) || []), o]);
    }
    return t;
  }, new Map());
}

/**
 * 图片类型素材定义列表
 */
export function useSourceDefineImageList(): TypeSourceDefineImage[] {
  const sourceTypeList = useSourceTypeList();
  const sourceDefineList = useSourceDefineList();
  const imageSourceTags = sourceTypeList
    .filter(item => item.type === SOURCE_TYPES.IMAGE)
    .map(item => item.tag);
  return sourceDefineList.flatMap(item =>
    imageSourceTags.includes(item.tagName) ? [item] : []
  ) as TypeSourceDefineImage[];
}

/**
 * 值类型素材定义列表
 */
export function useSourceDefineValueList(): TypeSourceDefineValue[] {
  const XML_VALUE_TYPE = new Set([
    SOURCE_TYPES.COLOR,
    SOURCE_TYPES.BOOLEAN,
    SOURCE_TYPES.STRING,
    SOURCE_TYPES.NUMBER
  ]);
  const sourceTypeList = useSourceTypeList();
  const sourceDefineList = useSourceDefineList();
  const valueSourceTags = sourceTypeList
    .filter(item => XML_VALUE_TYPE.has(item.type))
    .map(item => item.tag);
  return sourceDefineList.flatMap(item =>
    valueSourceTags.includes(item.tagName) ? [item] : []
  ) as TypeSourceDefineValue[];
}

/**
 * 获取当前所有元素列表
 */
export function useLayoutElementList(): TypeLayoutElement[] {
  return useEditorSelector(selectLayoutSourceList);
}

/**
 * 获取图片类型元素列表
 */
export function useLayoutImageList(): TypeLayoutImageElement[] {
  return useEditorSelector(selectLayoutImageList);
}

/**
 * 获取 xml 类型元素列表
 */
export function useTextSourceList(): TypeLayoutTextElement[] {
  return useEditorSelector(selectLayoutTextList);
}

/**
 * 获取素材的绝对路径
 * @param relativePath
 * @returns
 */
export function useAbsolutePathInSource(relativePath: string): string {
  const sourceConfigRoot = useSourceConfigRoot();
  return path.join(sourceConfigRoot, relativePath);
}

/**
 * 生成配置资源图片 url
 * @param relativePath
 * @returns
 */
export function useSourceImageUrl(relativePath: string): string {
  const prefix = useImagePrefix();
  const absolute = useAbsolutePathInSource(relativePath);
  return prefix + absolute;
}
