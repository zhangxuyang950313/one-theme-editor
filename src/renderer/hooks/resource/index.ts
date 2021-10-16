import path from "path";
import { ActionSetScenarioOption } from "@/store/starter/action";
import {
  ActionSetCurrentModule,
  ActionSetCurrentPage
} from "@/store/editor/action";
import { TypeScenarioOption } from "src/types/scenario.config";
import {
  TypeModuleConfig,
  TypePageOption,
  TypePageConfig
} from "src/types/resource.config";
import {
  TypeResourceDefinition,
  TypeLayoutElement,
  TypeLayoutImageElement,
  TypeLayoutTextElement
} from "src/types/resource.page";
import {
  useStarterDispatch,
  useEditorDispatch,
  useStarterSelector,
  useEditorSelector,
  useGlobalSelector
} from "@/store/index";
import { LAYOUT_ELEMENT_TAG } from "src/enum";
import { useImagePrefix } from "../image";

/**
 * 获取资源配置根目录
 * @returns
 */
export function useResConfigDir(): string {
  return useGlobalSelector(
    state => state.base.appPath.RESOURCE_CONFIG_DIR || ""
  );
}

/**
 * 获取当前资源配置目录
 * @returns
 */
export function useResConfigRootWithNS(): string {
  const resourceSrc = useEditorSelector(state => state.projectData.resourceSrc);
  const resourceConfigDir = useResConfigDir();
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
export function useCurrentResModule(): [
  TypeModuleConfig,
  (data: TypeModuleConfig) => void
] {
  const dispatch = useEditorDispatch();
  const currentModule = useEditorSelector(state => state.currentModule);
  return [currentModule, data => dispatch(ActionSetCurrentModule(data))];
}

/**
 * 获取当前选择的页面配置信息
 * @returns
 */
export function useCurrentPageOption(): [
  TypePageOption,
  (data: TypePageOption) => void
] {
  const dispatch = useEditorDispatch();
  const pageConf = useEditorSelector(state => state.currentPage);
  return [pageConf, data => dispatch(ActionSetCurrentPage(data))];
}

/**
 * 获取当前选择的页面配置数据
 * @returns
 */
export function useCurrentPageConfig(): TypePageConfig | null {
  return useEditorSelector(state => {
    return state.pageConfigMap[state.currentPage.src] || null;
  });
}

/**
 * 获取素材定义列表
 */
export function useResourceList(): TypeResourceDefinition[] {
  const curResPageConfig = useCurrentPageConfig();
  return curResPageConfig?.resourceList || [];
}

/**
 * 获取当前所有元素列表
 */
export function useLayoutElementList(): TypeLayoutElement[] {
  return useEditorSelector(state => {
    const pageConfSrc = state.currentPage.src;
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
    item.elementTag === LAYOUT_ELEMENT_TAG.Image ? [item] : []
  );
}

/**
 * 获取 xml 类型元素列表
 */
export function useLayoutTestList(): TypeLayoutTextElement[] {
  const layoutElementList = useLayoutElementList();
  return layoutElementList.flatMap(item =>
    item.elementTag === LAYOUT_ELEMENT_TAG.Text ? [item] : []
  );
}

/**
 * 获取素材的绝对路径
 * @param relativePath
 * @returns
 */
export function useResourceAbsolutePath(relativePath: string): string {
  const resourceConfigRoot = useResConfigRootWithNS();
  return path.join(resourceConfigRoot, relativePath);
}

/**
 * 生成配置资源图片 url
 * @param relativePath
 * @returns
 */
export function useResourceImageUrl(relativePath: string): string {
  const prefix = useImagePrefix();
  const absolute = useResourceAbsolutePath(relativePath);
  return prefix + absolute;
}
