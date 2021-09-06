import path from "path";
import {
  apiGetProjectByUUID,
  apiGetProjectFileData,
  apiGetProjectList
} from "@/request/index";
import { useAxiosCanceler } from "@/hooks/index";
import {
  useBrandOption,
  useFetchPageConfList,
  useFetchSourceConfig,
  useSourcePageData,
  useSourceConfigRootWithNS
} from "@/hooks/source";
import {
  ActionInitEditor,
  ActionPatchProjectSourceData,
  ActionSetProjectData
} from "@/store/editor/action";
import {
  selectProjectUUID,
  selectProjectData,
  selectProjectInfo,
  selectProjectRoot,
  selectProjectFileDataMap,
  selectProjectXmlFileDataMap,
  selectProjectImageFileDataMap
} from "@/store/editor/selector";
import { useEditorDispatch, useEditorSelector } from "@/store/index";
import {
  TypeProjectDataDoc,
  TypeProjectInfo,
  TypeProjectFileData
} from "src/types/project";

import ERR_CODE from "src/common/errorCode";
import XMLNodeElement from "src/server/compiler/XMLNodeElement";
import { useLayoutEffect, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { notification } from "antd";
import { FETCH_STATUS, FILE_STATUS } from "src/enum";
import { TypeSourceConfigData, TypeSourcePageData } from "src/types/source";
import { useImagePrefix } from "./image";
import { useFSWatcherCreator } from "./fileWatcher";

// 获取项目列表
export function useProjectList(): [
  TypeProjectDataDoc[],
  FETCH_STATUS,
  () => Promise<void>
] {
  // 使用机型隔离查询
  const [brandOption] = useBrandOption();
  const [value, updateValue] = useState<TypeProjectDataDoc[]>([]);
  const [status, setStatus] = useState<FETCH_STATUS>(FETCH_STATUS.INITIAL);
  const registerCancelToken = useAxiosCanceler();

  const refresh = useCallback(async () => {
    if (!brandOption.md5) return;
    setStatus(FETCH_STATUS.LOADING);
    apiGetProjectList(brandOption, registerCancelToken).then(projects => {
      console.log("获取工程列表：", projects);
      updateValue(projects);
      setStatus(FETCH_STATUS.SUCCESS);
    });
  }, [brandOption]);

  useLayoutEffect(() => {
    if (brandOption) refresh();
  }, [brandOption, refresh]);
  return [value, status, refresh];
}

/**
 * 加载工程
 * @param uuid
 * @returns
 */
export function useFetchProjectData(): [
  TypeProjectDataDoc,
  FETCH_STATUS,
  () => Promise<void>
] {
  // 从路由参数中获得工程 uuid
  const { uuid } = useParams<{ uuid: string }>();
  const dispatch = useEditorDispatch();
  const projectData = useProjectData();
  const [status, setStatus] = useState<FETCH_STATUS>(FETCH_STATUS.INITIAL);
  const handleFetch = async () => {
    setStatus(FETCH_STATUS.LOADING);
    return apiGetProjectByUUID(uuid)
      .then(project => {
        if (!project) throw new Error(ERR_CODE[2005]);
        console.log(`载入工程：: ${uuid}`);
        dispatch(ActionSetProjectData(project));
        setStatus(FETCH_STATUS.SUCCESS);
      })
      .catch(() => {
        dispatch(ActionInitEditor());
        setStatus(FETCH_STATUS.FAIL);
      });
  };
  useEffect(() => {
    handleFetch().catch(err => {
      notification.error({ message: err.message });
    });
  }, [uuid]);
  return [projectData, status, handleFetch];
}

/**
 * 初始化工程，需要增加流程在这里添加即可
 * 注意如果非懒加载要在 hooks 返回 loading 状态
 * @returns
 */
type TypeInitProjectData = {
  projectData: TypeProjectDataDoc;
  sourceConfig: TypeSourceConfigData;
  pageConfigList: TypeSourcePageData[];
};
export function useInitProject(): [
  TypeInitProjectData,
  FETCH_STATUS,
  () => Promise<TypeInitProjectData>
] {
  const [projectData, step1Status, handleFetch1] = useFetchProjectData();
  const [sourceConfig, step2Status, handleFetch2] = useFetchSourceConfig();
  const [pageConfigList, step3Status, handleFetch3] = useFetchPageConfList();
  const dispatch = useEditorDispatch();
  usePatchPageSourceData();
  useLayoutEffect(() => {
    // 退出退出当前组件后初始化数据
    return () => {
      dispatch(ActionInitEditor());
    };
  }, []);
  const statusList = [step1Status, step2Status, step3Status];
  let status = FETCH_STATUS.INITIAL;
  if (statusList.every(o => o === FETCH_STATUS.LOADING)) {
    status = FETCH_STATUS.LOADING;
  } else if (statusList.every(o => o === FETCH_STATUS.SUCCESS)) {
    status = FETCH_STATUS.SUCCESS;
  } else if (statusList.some(o => o === FETCH_STATUS.FAIL)) {
    status = FETCH_STATUS.FAIL;
  }
  const result = { projectData, sourceConfig, pageConfigList };
  const fetchAll = async () => {
    await Promise.all([handleFetch1(), handleFetch2(), handleFetch3()]);
    return result;
  };
  return [result, status, fetchAll];
}

// 获取工程数据
export function useProjectData(): TypeProjectDataDoc {
  return useEditorSelector(selectProjectData);
}

// 获取 工程描述信息
export function useProjectInfo(): TypeProjectInfo {
  return useEditorSelector(selectProjectInfo);
}

// 获取工程目录
export function useProjectRoot(): string {
  return useEditorSelector(selectProjectRoot);
}

// 工程 uuid
export function useProjectUUID(): string {
  return useEditorSelector(selectProjectUUID);
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

/**
 * 监听当前页面所有素材
 */
export function usePatchPageSourceData(): void {
  const uuid = useProjectUUID();
  const projectRoot = useProjectRoot();
  const pageData = useSourcePageData();
  const dispatch = useEditorDispatch();
  const createWatcher = useFSWatcherCreator();
  useEffect(() => {
    if (!pageData || !uuid || !projectRoot) return;
    const watcher = createWatcher({ cwd: projectRoot });
    const sourceSrcSet = new Set(pageData.sourceDefineList.map(o => o.src));
    const listener = async (file: string, event: FILE_STATUS) => {
      if (!sourceSrcSet.has(file)) return;
      console.log(`监听文件变动（${event}） '${file}' `);
      switch (event) {
        case FILE_STATUS.ADD:
        case FILE_STATUS.UNLINK:
        case FILE_STATUS.CHANGE: {
          const fileData = await apiGetProjectFileData(uuid, file);
          dispatch(ActionPatchProjectSourceData(fileData));
        }
      }
    };
    watcher
      .on(FILE_STATUS.ADD, file => listener(file, FILE_STATUS.ADD))
      .on(FILE_STATUS.CHANGE, file => listener(file, FILE_STATUS.CHANGE))
      .on(FILE_STATUS.UNLINK, file => listener(file, FILE_STATUS.UNLINK))
      .add(projectRoot);
  }, [uuid, pageData, projectRoot]);

  // useProjectFileWatcher(Array.from(sourceFilepathSet), async file => {
  //   const fileData = await apiGetProjectFileData(uuid, file);
  //   dispatch(ActionPatchProjectSourceData(fileData));
  // });
}

export function useProjectFileDataMap(): Map<string, TypeProjectFileData> {
  const projectFileDataMap = useEditorSelector(selectProjectFileDataMap);
  return new Map(Object.entries(projectFileDataMap));
}

/**
 * @returns 工程图片文件数据map
 */
export function useProjectImageUrlBySrc(src: string): string {
  const imageFileDataMap = useEditorSelector(selectProjectImageFileDataMap);
  const imageData = imageFileDataMap.get(src);
  return imageData?.url || "";
}

/**
 * @returns 工程中 xml 文件数据map
 */
export function useProjectXmlValueBySrc(name: string, src: string): string {
  const xmlFileDataMap = useEditorSelector(selectProjectXmlFileDataMap);
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
