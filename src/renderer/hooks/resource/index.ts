import path from "path";
import { ActionSetScenarioOption } from "@/store/starter/action";
import {
  ActionSetCurrentModule,
  ActionSetCurrentPage
} from "@/store/editor/action";
import {
  TypeScenarioOption,
  TypeResourceConfig,
  TypeResourceOption,
  TypeResourcePageGroupConf,
  TypeResourceModuleConf,
  TypeResourcePageOption,
  TypeResourceTypeConf,
  TypeLayoutElement,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeResourcePageConf,
  TypeResourceDefinition
} from "src/types/resource";
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

export function useResourceOptionList(): TypeResourceOption[] {
  return useStarterSelector(state => state.resourceOptionList);
}

/**
 * 获取当前资源配置数据
 * @returns
 */
export function useResourceConfig(): TypeResourceConfig {
  return useEditorSelector(state => state.resourceConfig);
}

/**
 * 获取资源配置根目录
 * @returns
 */
export function useResourceConfigDir(): string {
  return useGlobalSelector(
    state => state.base.appPath.RESOURCE_CONFIG_DIR || ""
  );
}

/**
 * 获取当前资源配置目录
 * @returns
 */
export function useResourceConfigRootWithNS(): string {
  const resourceConfigPath = useResourceConfigPath();
  const resourceConfigDir = useResourceConfigDir();
  return path.join(resourceConfigDir, path.dirname(resourceConfigPath));
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
export function useResourceConfigPath(): string {
  return useEditorSelector(state => state.resourceConfigPath);
}

/**
 * 获取当前配置模块列表
 * @returns
 */
export function useResourceModuleList(): TypeResourceModuleConf[] {
  return useEditorSelector(state => state.resourceModuleList);
}

/**
 * 获取当前选择的模块配置
 * @returns
 */
export function useResourceModuleConf(): [
  TypeResourceModuleConf,
  (data: TypeResourceModuleConf) => void
] {
  const dispatch = useEditorDispatch();
  const resourceModuleConf = useEditorSelector(
    state => state.resourceModuleSelected
  );
  return [resourceModuleConf, data => dispatch(ActionSetCurrentModule(data))];
}

/**
 * 当前当前模块页面组列表
 */
export function useResourcePageGroupList(): TypeResourcePageGroupConf[] {
  return useEditorSelector(
    state => state.resourceModuleSelected.groupList || []
  );
}

/**
 * 获取当前选择的页面配置
 * @returns
 */
export function useResourcePageOption(): [
  TypeResourcePageOption,
  (data: TypeResourcePageOption) => void
] {
  const dispatch = useEditorDispatch();
  const pageConf = useEditorSelector(state => state.resourcePageSelected);
  return [pageConf, data => dispatch(ActionSetCurrentPage(data))];
}

export function useResourcePageConfig(): TypeResourcePageConf | null {
  return useEditorSelector(state => {
    const pageConfSrc = state.resourcePageSelected.src;
    return state.resourcePageConfigMap[pageConfSrc] || null;
  });
}

/**
 * 获取当前元素类型配置
 */
export function useResourceTypeList(): TypeResourceTypeConf[] {
  return useEditorSelector(state => state.resourceTypeList);
}

/**
 * 获取素材定义数据列表
 */
export function useResourceDefinitionList(): TypeResourceDefinition[] {
  const resourcePageSelected = useResourcePageConfig();
  return resourcePageSelected?.resourceDefinitionList || [];
}

/**
 * 获取当前所有元素列表
 */
export function useLayoutElementList(): TypeLayoutElement[] {
  return useEditorSelector(state => {
    const pageConfSrc = state.resourcePageSelected.src;
    if (!pageConfSrc) return [];
    return state.resourcePageConfigMap[pageConfSrc]?.layoutElementList || [];
  });
}

/**
 * 获取图片类型元素列表
 */
export function useLayoutImageList(): TypeLayoutImageElement[] {
  const layoutElementList = useLayoutElementList();
  return layoutElementList.flatMap(item =>
    item.resourceTag === ELEMENT_TAG.Image ? [item] : []
  );
}

/**
 * 获取 xml 类型元素列表
 */
export function useTextSourceList(): TypeLayoutTextElement[] {
  const layoutElementList = useLayoutElementList();
  return layoutElementList.flatMap(item =>
    item.resourceTag === ELEMENT_TAG.Text ? [item] : []
  );
}

/**
 * 获取素材的绝对路径
 * @param relativePath
 * @returns
 */
export function useAbsolutePathInSource(relativePath: string): string {
  const resourceConfigRoot = useResourceConfigRootWithNS();
  return path.join(resourceConfigRoot, relativePath);
}

/**
 * 生成配置资源图片 url
 * @param relativePath
 * @returns
 */
export function useResourceImageUrl(relativePath: string): string {
  const prefix = useImagePrefix();
  const absolute = useAbsolutePathInSource(relativePath);
  return prefix + absolute;
}
