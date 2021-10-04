import path from "path";
import { useLayoutEffect, useEffect, useState } from "react";
import { useMergeLoadStatus } from "@/hooks/index";
import { useResConfigRootWithNS } from "@/hooks/resource/index";
import { ActionInitEditor } from "@/store/editor/action";
import { useEditorDispatch, useEditorSelector } from "@/store/index";
import { TypeProjectDataDoc, TypeFileData } from "src/types/project";
import { FILE_TEMPLATE_TYPE, LOAD_STATUS, RESOURCE_PROTOCOL } from "src/enum";
import {
  TypeFileTemplateConfig,
  TypeResourceConfig,
  TypeResPageConfig,
  TypeScenarioConfig
} from "src/types/resource";
import { FileTemplate } from "src/data/ScenarioConfig";
import XMLNodeElement from "src/server/compiler/XMLNodeElement";
import { useImagePrefix } from "../image";
import useFetchProjectData from "../project/useFetchProjectData";
import useFetchResourceConfig from "../resource/useFetchResourceConfig";
import useFetchPageConfList from "../resource/useFetchPageConfList";
import useFetchScenarioConfig from "../resource/useFetchScenarioConfig";

// 工程 uuid
export function useProjectUUID(): string {
  return useEditorSelector(state => state.projectData.uuid);
}

// 工程本地路径
export function useProjectRoot(): string {
  return useEditorSelector(state => state.projectData.root);
}

// 工程信息模板配置
export function useProjectInfoConfig(): TypeFileTemplateConfig {
  const fileTempList = useEditorSelector(
    state => state.scenarioConfig.fileTempList
  );
  return (
    fileTempList.find(item => item.type === FILE_TEMPLATE_TYPE.INFO) ||
    FileTemplate.default
  );
}

/**
 * 初始化工程，需要增加流程在这里添加即可
 * 注意如果非懒加载要在 hooks 返回 loading 状态
 * @returns
 */
type TypeInitializedProjectData = {
  projectData: TypeProjectDataDoc;
  scenarioConfig: TypeScenarioConfig;
  resourceConfig: TypeResourceConfig;
  pageConfigList: TypeResPageConfig[];
};
export function useInitProject(): [
  TypeInitializedProjectData,
  LOAD_STATUS,
  () => Promise<TypeInitializedProjectData>
] {
  const [projectData, step1Status, handleFetch1] = useFetchProjectData();
  const [scenarioConfig, step2Status, handleFetch2] = useFetchScenarioConfig();
  const [resourceConfig, step3Status, handleFetch3] = useFetchResourceConfig();
  const [pageConfigList, step4Status, handleFetch4] = useFetchPageConfList();
  const status = useMergeLoadStatus([
    step1Status,
    step2Status,
    step3Status,
    step4Status
  ]);
  const dispatch = useEditorDispatch();
  useLayoutEffect(() => {
    // 退出退出当前组件后初始化数据
    return () => {
      dispatch(ActionInitEditor());
    };
  }, []);
  const result: TypeInitializedProjectData = {
    projectData,
    scenarioConfig,
    resourceConfig,
    pageConfigList
  };
  const fetchAll = async () => {
    await Promise.all([
      handleFetch1(),
      handleFetch2(),
      handleFetch3(),
      handleFetch4()
    ]);
    return result;
  };
  return [result, status, fetchAll];
}

// 处理工程路径
export function useResolveProjectPath(relativePath = ""): string {
  const projectRoot = useProjectRoot();
  const [projectPath, setProjectPath] = useState("");

  useEffect(() => {
    if (!(projectRoot && relativePath)) return;
    setProjectPath(path.join(projectRoot, relativePath));
  }, [relativePath]);

  return projectPath;
}

// 处理素材路径
export function useResolveSourcePath(relativePath: string): string {
  const resourceRoot = useResConfigRootWithNS();
  const [resourcePath, setResourcePath] = useState("");

  useEffect(() => {
    if (!resourceRoot || !relativePath) return;
    setResourcePath(path.join(resourceRoot, relativePath));
  }, [relativePath]);

  return resourcePath;
}

export function useFileDataMap(): Map<string, TypeFileData> {
  const fileDataMap = useEditorSelector(state => state.fileDataMap);
  return new Map(Object.entries(fileDataMap));
}

/**
 * @returns 工程图片文件数据map
 */
export function useProjectImageUrlBySrc(src: string): string {
  const imageFileDataMap = useEditorSelector(state => {
    const entries = Object.entries(state.fileDataMap).flatMap(([key, val]) => {
      return val.type === RESOURCE_PROTOCOL.IMAGE
        ? [[key, val] as [string, typeof val]]
        : [];
    });
    return new Map(entries);
  });
  const imageData = imageFileDataMap.get(src);
  return imageData?.url || "";
}

/**
 * @returns 工程中 xml 文件数据map
 */
export function useProjectXmlValueBySrc(name: string, src: string): string {
  const xmlFileDataMap = useEditorSelector(state => {
    const entries = Object.entries(state.fileDataMap).flatMap(([key, val]) => {
      return val.type === RESOURCE_PROTOCOL.XML
        ? [[key, val] as [string, typeof val]]
        : [];
    });
    return new Map(entries);
  });
  const xmlData = xmlFileDataMap.get(src);
  if (!xmlData?.data) return "";
  return new XMLNodeElement(xmlData.data)
    .getFirstChildNode()
    .getFirstChildNodeByAttrValue("name", name)
    .getFirstTextChildValue();
}

/**
 * 获取工程相对路径的绝对路径
 * @param relativePath
 * @returns
 */
export function useAbsolutePathInProject(relativePath: string): string {
  const projectRoot = useProjectRoot();
  return path.join(projectRoot, relativePath);
}

/**
 * 生成工程资源图片 url
 * @param relativePath
 */
export function useProjectImageUrl(relativePath?: string): string {
  const prefix = useImagePrefix();
  const projectRoot = useProjectRoot();

  return projectRoot && relativePath
    ? prefix + path.join(projectRoot, relativePath)
    : "";
}
