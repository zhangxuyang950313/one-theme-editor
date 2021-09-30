import path from "path";
import { ActionSetScenarioOption } from "@/store/starter/action";
import {
  ActionSetCurrentModule,
  ActionSetCurrentPage
} from "@/store/editor/action";
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
  TypeSourceDefine
} from "src/types/source";
import {
  useStarterDispatch,
  useEditorDispatch,
  useStarterSelector,
  useEditorSelector,
  useGlobalSelector
} from "@/store/index";
import { ELEMENT_TAG } from "src/enum";
import { useImagePrefix } from "../image";

export function useScenarioOptionList(): TypeScenarioOption[] {
  return useStarterSelector(state => state.scenarioOptionList);
}

export function useSourceOptionList(): TypeSourceOption[] {
  return useStarterSelector(state => state.sourceOptionList);
}

/**
 * 获取当前资源配置数据
 * @returns
 */
export function useSourceConfig(): TypeSourceConfig {
  return useEditorSelector(state => state.sourceConfig);
}

/**
 * 获取资源配置根目录
 * @returns
 */
export function useSourceConfigDir(): string {
  return useGlobalSelector(state => state.base.appPath.SOURCE_CONFIG_DIR || "");
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
  const currentOption = useStarterSelector(
    state => state.scenarioOptionSelected
  );
  return [currentOption, data => dispatch(ActionSetScenarioOption(data))];
}

/**
 * 获取资源配置文件 url
 * @returns
 */
export function useSourceConfigPath(): string {
  return useEditorSelector(state => state.sourceConfigPath);
}

/**
 * 获取当前配置模块列表
 * @returns
 */
export function useSourceModuleList(): TypeSourceModuleConf[] {
  return useEditorSelector(state => state.sourceModuleList);
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
  const sourceModuleConf = useEditorSelector(
    state => state.sourceModuleSelected
  );
  return [sourceModuleConf, data => dispatch(ActionSetCurrentModule(data))];
}

/**
 * 当前当前模块页面组列表
 */
export function useSourcePageGroupList(): TypeSourcePageGroupConf[] {
  return useEditorSelector(state => state.sourceModuleSelected.groupList || []);
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
  const pageConf = useEditorSelector(state => state.sourcePageSelected);
  return [pageConf, data => dispatch(ActionSetCurrentPage(data))];
}

export function useSourcePageData(): TypeSourcePageData | null {
  return useEditorSelector(state => {
    const pageConfSrc = state.sourcePageSelected.src;
    return state.sourcePageDataMap[pageConfSrc] || null;
  });
}

/**
 * 获取当前元素类型配置
 */
export function useSourceTypeList(): TypeSourceTypeConf[] {
  return useEditorSelector(state => state.sourceTypeList);
}

/**
 * 获取素材定义数据列表
 */
export function useSourceDefineList(): TypeSourceDefine[] {
  const sourcePageSelected = useSourcePageData();
  return sourcePageSelected?.sourceDefineList || [];
}

/**
 * 获取当前所有元素列表
 */
export function useLayoutElementList(): TypeLayoutElement[] {
  return useEditorSelector(state => {
    const pageConfSrc = state.sourcePageSelected.src;
    if (!pageConfSrc) return [];
    return state.sourcePageDataMap[pageConfSrc]?.layoutElementList || [];
  });
}

/**
 * 获取图片类型元素列表
 */
export function useLayoutImageList(): TypeLayoutImageElement[] {
  const layoutElementList = useLayoutElementList();
  return layoutElementList.flatMap(item =>
    item.sourceTag === ELEMENT_TAG.Image ? [item] : []
  );
}

/**
 * 获取 xml 类型元素列表
 */
export function useTextSourceList(): TypeLayoutTextElement[] {
  const layoutElementList = useLayoutElementList();
  return layoutElementList.flatMap(item =>
    item.sourceTag === ELEMENT_TAG.Text ? [item] : []
  );
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
