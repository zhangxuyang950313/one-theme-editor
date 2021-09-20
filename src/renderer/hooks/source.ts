import path from "path";
import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import { message, notification } from "antd";
import {
  apiGetScenarioOptionList,
  apiGetSourceOptionList,
  apiGetSourceConfig,
  apiGetSourcePageConfData
} from "@/request/index";
import { selectSourceConfigDir } from "@/store/global/modules/base/selector";
import {
  ActionSetScenarioOptionList,
  ActionSetScenarioOption,
  ActionSetSourceOptionList
} from "@/store/starter/action";
import {
  selectScenarioOption,
  selectScenarioOptionList,
  selectSourceOptionList
} from "@/store/starter/selector";
import {
  ActionSetCurrentModule,
  ActionSetCurrentPage,
  ActionSetSourceConfig,
  ActionPatchPageDataMap
} from "@/store/editor/action";
import {
  selectSourceConfigPath,
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
  TypeScenarioOption,
  TypeSourceConfig,
  TypeSourceOption,
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
} from "src/types/source";
import {
  useStarterDispatch,
  useEditorDispatch,
  useStarterSelector,
  useEditorSelector,
  useGlobalSelector
} from "@/store/index";
import ERR_CODE from "src/common/errorCode";
import SourceConfig from "src/data/SourceConfig";
import { asyncQueue, sleep } from "src/utils/index";
import { LOAD_STATUS, SOURCE_TYPES } from "src/enum/index";
import { useImagePrefix } from "./image";
import { useAsyncUpdater } from "./index";

export function useScenarioOptionList(): TypeScenarioOption[] {
  return useStarterSelector(selectScenarioOptionList);
}

export function useSourceOptionList(): TypeSourceOption[] {
  return useStarterSelector(selectSourceOptionList);
}

/**
 * 获取当前资源配置数据
 * @returns
 */
export function useSourceConfig(): TypeSourceConfig {
  return useEditorSelector(selectSourceConfig);
}

/**
 * 获取资源配置根目录
 * @returns
 */
export function useSourceConfigDir(): string {
  return useGlobalSelector(selectSourceConfigDir);
}

/**
 * 获取当前资源配置目录
 * @returns
 */
export function useSourceConfigRootWithNS(): string {
  const sourceConfigPath = useSourceConfigPath();
  const sourceConfigDir = useSourceConfigDir();
  return path.join(sourceConfigDir, path.dirname(sourceConfigPath));
}

/**
 * 获取当前选择场景信息
 * @returns
 */
export function useScenarioOption(): [
  TypeScenarioOption,
  (data: TypeScenarioOption) => void
] {
  const dispatch = useStarterDispatch();
  const currentOption = useStarterSelector(selectScenarioOption);
  return [currentOption, data => dispatch(ActionSetScenarioOption(data))];
}

/**
 * 获取配置的场景列表
 * @returns
 */
export function useFetchScenarioOptionList(): {
  state: TypeScenarioOption[];
  status: LOAD_STATUS;
  fetch: () => Promise<void>;
} {
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [state, setState] = useState<TypeScenarioOption[]>([]);
  const dispatch = useStarterDispatch();
  const registerUpdater = useAsyncUpdater();
  const fetch = async () => {
    try {
      setStatus(LOAD_STATUS.LOADING);
      const optList = await apiGetScenarioOptionList();
      // 去重
      const list = optList.reduce<TypeScenarioOption[]>((t, o) => {
        if (!t.some(item => item.md5 === o.md5)) t.push(o);
        return t;
      }, []);
      console.log("工程类型列表", list);
      registerUpdater(() => {
        setState(list);
        dispatch(ActionSetScenarioOptionList(list));
        setStatus(LOAD_STATUS.SUCCESS);
      });
    } catch (e) {
      setStatus(LOAD_STATUS.FAILED);
    }
  };
  useLayoutEffect(() => {
    fetch();
  }, []);
  return { state, status, fetch };
}

/**
 * 获取编辑器列表
 * @returns
 */
export function useFetchSourceOptionList(): {
  state: TypeSourceOption[];
  status: LOAD_STATUS;
  fetch: () => Promise<void>;
} {
  const [state, setState] = useState<TypeSourceOption[]>([]);
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [currentScenarioOption] = useScenarioOption();
  const dispatch = useStarterDispatch();
  const fetch = async () => {
    if (!currentScenarioOption.src) return;
    setStatus(LOAD_STATUS.LOADING);
    await sleep(300);
    apiGetSourceOptionList(currentScenarioOption.src)
      .then(data => {
        console.log("配置列表：", data);
        setState(data);
        dispatch(ActionSetSourceOptionList(data));
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(err => {
        const content = ERR_CODE[3002];
        message.error({ content });
        console.log(`${content}: ${err}`);
        setStatus(LOAD_STATUS.FAILED);
      });
  };
  useLayoutEffect(() => {
    fetch();
  }, [currentScenarioOption]);
  return { state, status, fetch };
}

/**
 * 获取资源配置
 * @returns
 */
export function useFetchSourceConfig(): [
  TypeSourceConfig,
  LOAD_STATUS,
  () => Promise<void>
] {
  const dispatch = useEditorDispatch();
  const sourceConfigPath = useSourceConfigPath();
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [sourceConfig, setSourceConfig] = useState(SourceConfig.default);
  const doFetchData = useCallback(async () => {
    if (!sourceConfigPath) return;
    setStatus(LOAD_STATUS.LOADING);
    apiGetSourceConfig(sourceConfigPath)
      .then(data => {
        if (!data) throw new Error(ERR_CODE[3002]);
        console.log(`加载资源配置: ${sourceConfigPath}`, data);
        dispatch(ActionSetSourceConfig(data));
        setSourceConfig(data);
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(() => {
        setStatus(LOAD_STATUS.FAILED);
      });
  }, [sourceConfigPath]);
  useEffect(() => {
    doFetchData().catch(err => {
      notification.error({ message: err.message });
    });
  }, [sourceConfigPath]);
  return [sourceConfig, status, doFetchData];
}

/**
 * 获取资源配置文件 url
 * @returns
 */
export function useSourceConfigPath(): string {
  return useEditorSelector(selectSourceConfigPath);
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
  const sourceModuleConf = useEditorSelector(selectSourceModuleConf);
  return [sourceModuleConf, data => dispatch(ActionSetCurrentModule(data))];
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
export function useFetchPageConfList(): [
  TypeSourcePageData[],
  LOAD_STATUS,
  () => Promise<void>
] {
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [pageData, setPageData] = useState<TypeSourcePageData[]>([]);
  const dispatch = useEditorDispatch();
  const pageGroupList = useSourcePageGroupList();
  const sourceConfigPath = useSourceConfigPath();

  const handleFetch = async () => {
    if (!sourceConfigPath) return;
    const pageConfDataQueue = pageGroupList
      .flatMap(item => item.pageList)
      .map(item => async () => {
        const data = await apiGetSourcePageConfData({
          namespace: path.dirname(sourceConfigPath),
          config: item.src
        });
        dispatch(ActionPatchPageDataMap(data));
        return data;
      });
    setStatus(LOAD_STATUS.LOADING);
    return asyncQueue(pageConfDataQueue)
      .then(data => {
        setPageData(data);
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(err => {
        notification.error({ message: err.message });
        setStatus(LOAD_STATUS.FAILED);
      });
  };

  useEffect(() => {
    handleFetch().catch(err => {
      notification.error({ message: err.message });
    });
  }, [pageGroupList]);
  return [pageData, status, handleFetch];
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
  const sourceConfigRoot = useSourceConfigRootWithNS();
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
