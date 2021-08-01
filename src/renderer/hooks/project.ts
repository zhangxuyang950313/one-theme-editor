import path from "path";
import { useLayoutEffect, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import {
  apiGetProjectByUUID,
  apiGetProjectFileData,
  apiGetProjectList
} from "@/request/index";
import { useAxiosCanceler } from "@/hooks/index";
import {
  useBrandConf,
  useFetchPageConfData,
  useFetchSourceConfig,
  usePageData,
  useSourceConfigRoot
} from "@/hooks/source";
import {
  ActionPatchProjectSourceData,
  ActionSetProjectData
} from "@/store/editor/action";
import {
  getProjectData,
  getProjectFileDataMap,
  getProjectInfo,
  getProjectRoot,
  getProjectUUID
} from "@/store/editor/selector";
import { useEditorDispatch, useEditorSelector } from "@/store/index";
import {
  TypeProjectDataDoc,
  TypeProjectFileData,
  TypeProjectFileImageData,
  TypeProjectInfo
} from "types/project";

import ERR_CODE from "common/errorCode";
import { sleep } from "common/utils";
import { notification } from "antd";
import { PROJECT_FILE_TYPE } from "@/../enum";
import { useProjectFileWatcher } from "./fileWatcher";

// 获取项目列表
export function useProjectList(): [
  TypeProjectDataDoc[],
  boolean,
  () => Promise<void>
] {
  // 使用机型隔离查询
  const [brandConf] = useBrandConf();
  const [value, updateValue] = useState<TypeProjectDataDoc[]>([]);
  const [loading, updateLoading] = useState<boolean>(true);
  const registerCancelToken = useAxiosCanceler();

  const refresh = useCallback(async () => {
    updateLoading(true);
    if (!brandConf.type) return;
    return apiGetProjectList(brandConf, registerCancelToken)
      .then(projects => {
        console.log("获取工程列表：", projects);
        updateValue(projects);
      })
      .catch(console.log)
      .finally(() => {
        updateLoading(false);
      });
  }, [brandConf]);

  useLayoutEffect(() => {
    if (brandConf) refresh();
  }, [brandConf, refresh]);
  return [value, loading, refresh];
}

/**
 * 加载工程
 * @param uuid
 * @returns
 */
export function useFetchProjectData(): [
  TypeProjectDataDoc,
  boolean,
  () => Promise<void>
] {
  // 从路由参数中获得工程 uuid
  const { uuid } = useParams<{ uuid: string }>();
  const dispatch = useEditorDispatch();
  const projectData = useProjectData();
  const [loading, updateLoading] = useState(true);
  const handleFetch = async () => {
    updateLoading(true);
    const project = await apiGetProjectByUUID(uuid);
    if (!project) throw new Error(ERR_CODE[2005]);
    console.log(`载入工程：: ${uuid}`);
    dispatch(ActionSetProjectData(project));
    await sleep(300);
    updateLoading(false);
  };
  useEffect(() => {
    handleFetch().catch(err => {
      notification.error({ message: err.message });
    });
  }, [uuid]);
  return [projectData, loading, handleFetch];
}

/**
 * 加载工程总线，需要增加流程在这里添加即可
 * 注意如果非懒加载要在 hooks 返回 loading 状态
 * @returns
 */
export function useLoadProject(): boolean {
  const [projectData, step1Loading] = useFetchProjectData();
  const step2Loading = useFetchSourceConfig()[1];
  useFetchPageConfData();
  return !projectData || step1Loading || step2Loading;
}

// 获取工程数据
export function useProjectData(): TypeProjectDataDoc {
  return useEditorSelector(getProjectData);
}

// 获取 工程描述信息
export function useProjectInfo(): TypeProjectInfo {
  return useEditorSelector(getProjectInfo);
}

// 获取工程目录
export function useProjectRoot(): string {
  return useEditorSelector(getProjectRoot);
}

// 工程 uuid
export function useProjectUUID(): string {
  return useEditorSelector(getProjectUUID);
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
  const sourceRoot = useSourceConfigRoot();
  const [sourcePath, setSourcePath] = useState("");

  useEffect(() => {
    if (!sourceRoot || !relativePath) return;
    setSourcePath(path.join(sourceRoot, relativePath));
  }, [relativePath]);

  return sourcePath;
}

export function usePatchPageSourceData(): void {
  const uuid = useProjectUUID();
  const pageData = usePageData();
  const dispatch = useEditorDispatch();
  const sourceFilepathSet = (pageData?.sourceDefineList || []) //
    .reduce((t, o) => {
      if (o.src) t.add(o.src);
      return t;
    }, new Set<string>());
  useProjectFileWatcher(Array.from(sourceFilepathSet), async file => {
    console.log({ file });
    const fileData = await apiGetProjectFileData(uuid, file);
    dispatch(ActionPatchProjectSourceData(fileData));
  });
}

export function useProjectFileDataMap(): Map<string, TypeProjectFileData> {
  const projectFileDataMap = useEditorSelector(getProjectFileDataMap);
  return new Map(Object.entries(projectFileDataMap));
}

export function useProjectImageFileDataMap(): Map<
  string,
  TypeProjectFileImageData
> {
  const projectFileDataMap = useEditorSelector(getProjectFileDataMap);
  const entries = Object.entries(projectFileDataMap).filter(
    item => item[1].type === PROJECT_FILE_TYPE.IMAGE
  ) as [string, TypeProjectFileImageData][];
  return new Map(entries);
}
