import path from "path";
import { useMergeLoadStatus } from "@/hooks/index";
import { useSourceConfigRootWithNS } from "@/hooks/source/index";
import { ActionInitEditor } from "@/store/editor/action";
import {
  useEditorDispatch,
  useEditorSelector,
  useStarterSelector
} from "@/store/index";
import {
  TypeProjectDataDoc,
  TypeProjectFileData,
  TypeProjectInfo
} from "src/types/project";

import XMLNodeElement from "src/server/compiler/XMLNodeElement";
import { useLayoutEffect, useEffect, useState } from "react";
import { LOAD_STATUS, PROJECT_FILE_TYPE } from "src/enum";
import {
  TypeScenarioConf,
  TypeProjectInfoConf,
  TypeSourceConfig,
  TypeSourcePageData
} from "src/types/source";
import { useImagePrefix } from "../image";
import useFetchProjectData from "../project/useFetchProjectData";
import useFetchSourceConfig from "../source/useFetchSourceConfig";
import useFetchPageConfList from "../source/useFetchPageConfList";

export function useProjectList(): TypeProjectDataDoc[] {
  return useStarterSelector(state => state.projectList);
}

// 工程数据
export function useProjectData(): TypeProjectDataDoc {
  return useEditorSelector(state => state.projectData);
}

// 工程 uuid
export function useProjectUUID(): string {
  const projectData = useProjectData();
  return projectData.uuid;
}

// 工程本地路径
export function useProjectRoot(): string {
  const projectData = useProjectData();
  return projectData.projectRoot;
}

// 工程场景配置信息
export function useProjectScenarioConfig(): TypeScenarioConf {
  const projectData = useProjectData();
  return projectData.scenarioConfig;
}

// 工程描述信息
export function useProjectInfo(): TypeProjectInfo {
  const projectData = useProjectData();
  return projectData.projectInfo;
}

// 工程信息模板配置
export function useProjectInfoConfig(): TypeProjectInfoConf {
  const projectData = useProjectData();
  return projectData.scenarioConfig.projectInfoConfig;
}

/**
 * 初始化工程，需要增加流程在这里添加即可
 * 注意如果非懒加载要在 hooks 返回 loading 状态
 * @returns
 */
type TypeInitializedProjectData = {
  projectData: TypeProjectDataDoc;
  sourceConfig: TypeSourceConfig;
  pageConfigList: TypeSourcePageData[];
};
export function useInitProject(): [
  TypeInitializedProjectData,
  LOAD_STATUS,
  () => Promise<TypeInitializedProjectData>
] {
  const [projectData, step1Status, handleFetch1] = useFetchProjectData();
  const [sourceConfig, step2Status, handleFetch2] = useFetchSourceConfig();
  const [pageConfigList, step3Status, handleFetch3] = useFetchPageConfList();
  const status = useMergeLoadStatus([step1Status, step2Status, step3Status]);
  const dispatch = useEditorDispatch();
  // useSyncFileContent();
  useLayoutEffect(() => {
    // 退出退出当前组件后初始化数据
    return () => {
      dispatch(ActionInitEditor());
    };
  }, []);
  const result = { projectData, sourceConfig, pageConfigList };
  const fetchAll = async () => {
    await Promise.all([handleFetch1(), handleFetch2(), handleFetch3()]);
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
  const sourceRoot = useSourceConfigRootWithNS();
  const [sourcePath, setSourcePath] = useState("");

  useEffect(() => {
    if (!sourceRoot || !relativePath) return;
    setSourcePath(path.join(sourceRoot, relativePath));
  }, [relativePath]);

  return sourcePath;
}

export function useProjectFileDataMap(): Map<string, TypeProjectFileData> {
  const projectFileDataMap = useEditorSelector(
    state => state.projectFileDataMap
  );
  return new Map(Object.entries(projectFileDataMap));
}

/**
 * @returns 工程图片文件数据map
 */
export function useProjectImageUrlBySrc(src: string): string {
  const imageFileDataMap = useEditorSelector(state => {
    const entries = Object.entries(state.projectFileDataMap).flatMap(
      ([key, val]) => {
        return val.type === PROJECT_FILE_TYPE.IMAGE
          ? [[key, val] as [string, typeof val]]
          : [];
      }
    );
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
    const entries = Object.entries(state.projectFileDataMap).flatMap(
      ([key, val]) => {
        return val.type === PROJECT_FILE_TYPE.XML
          ? [[key, val] as [string, typeof val]]
          : [];
      }
    );
    return new Map(entries);
  });
  const xmlData = xmlFileDataMap.get(src);
  if (!xmlData?.element) return "";
  return new XMLNodeElement(xmlData.element)
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
