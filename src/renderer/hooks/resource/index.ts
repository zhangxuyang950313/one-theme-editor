import path from "path";
import { ActionSetScenarioOption } from "@/store/starter/action";
import {
  ActionSetCurrentModule,
  ActionSetCurrentPage
} from "@/store/editor/action";
import {
  TypeScenarioOption,
  TypeResModule,
  TypeResPageOption,
  TypeResType,
  TypeLayoutElement,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeResPageConfig,
  TypeResDefinition
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
  const resourceSrc = useEditorSelector(state => state.projectData.resourceSrc);
  const resourceConfigDir = useResourceConfigDir();
  return path.join(resourceConfigDir, path.dirname(resourceSrc));
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
  const currentOption = useStarterSelector(state => state.scenarioSelected);
  return [currentOption, data => dispatch(ActionSetScenarioOption(data))];
}

/**
 * 获取当前选择的模块配置
 * @returns
 */
export function useResourceModuleConf(): [
  TypeResModule,
  (data: TypeResModule) => void
] {
  const dispatch = useEditorDispatch();
  const resourceModuleConf = useEditorSelector(state => state.moduleConfig);
  return [resourceModuleConf, data => dispatch(ActionSetCurrentModule(data))];
}

/**
 * 获取当前选择的页面配置
 * @returns
 */
export function useResourcePageOption(): [
  TypeResPageOption,
  (data: TypeResPageOption) => void
] {
  const dispatch = useEditorDispatch();
  const pageConf = useEditorSelector(state => state.pageOption);
  return [pageConf, data => dispatch(ActionSetCurrentPage(data))];
}

export function useResourcePageConfig(): TypeResPageConfig | null {
  return useEditorSelector(state => {
    const pageConfSrc = state.pageOption.src;
    return state.pageConfigMap[pageConfSrc] || null;
  });
}

/**
 * 获取当前元素类型配置
 */
export function useResourceTypeList(): TypeResType[] {
  return useEditorSelector(state => state.resourceConfig.typeList);
}

/**
 * 获取素材定义数据列表
 */
export function useResourceList(): TypeResDefinition[] {
  const resourcePageSelected = useResourcePageConfig();
  return resourcePageSelected?.resourceList || [];
}

/**
 * 获取当前所有元素列表
 */
export function useLayoutElementList(): TypeLayoutElement[] {
  return useEditorSelector(state => {
    const pageConfSrc = state.pageOption.src;
    if (!pageConfSrc) return [];
    return state.pageConfigMap[pageConfSrc]?.layoutElementList || [];
  });
}

/**
 * 获取图片类型元素列表
 */
export function useLayoutImageList(): TypeLayoutImageElement[] {
  const layoutElementList = useLayoutElementList();
  return layoutElementList.flatMap(item =>
    item.tag === ELEMENT_TAG.Image ? [item] : []
  );
}

/**
 * 获取 xml 类型元素列表
 */
export function useTextSourceList(): TypeLayoutTextElement[] {
  const layoutElementList = useLayoutElementList();
  return layoutElementList.flatMap(item =>
    item.tag === ELEMENT_TAG.Text ? [item] : []
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
