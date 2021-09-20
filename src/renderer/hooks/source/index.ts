import path from "path";
import { selectSourceConfigDir } from "@/store/global/modules/base/selector";
import { ActionSetScenarioOption } from "@/store/starter/action";
import {
  selectScenarioOption,
  selectScenarioOptionList,
  selectSourceOptionList
} from "@/store/starter/selector";
import {
  ActionSetCurrentModule,
  ActionSetCurrentPage
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
  TypeSourceDefine
} from "src/types/source";
import {
  useStarterDispatch,
  useEditorDispatch,
  useStarterSelector,
  useEditorSelector,
  useGlobalSelector
} from "@/store/index";
import { useImagePrefix } from "../image";

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
