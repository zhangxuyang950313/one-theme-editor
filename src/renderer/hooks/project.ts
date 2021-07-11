import path from "path";
import { Stats } from "fs";
import { useParams } from "react-router";
import {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
  useContext
} from "react";
import { apiGetProjectByUUID, apiGetProjectList } from "@/api/index";
import { useAxiosCanceler } from "@/hooks/index";
import {
  useBrandConf,
  useFetchPageConfData,
  useFetchSourceConfig,
  useSourceConfigRoot
} from "@/hooks/source";
import { ActionSetProjectData } from "@/store/editor/action";
import {
  getProjectData,
  getProjectInfo,
  getProjectPathname
} from "@/store/editor/selector";
import { useEditorDispatch, useEditorSelector } from "@/store/index";
import { TypeProjectDataDoc, TypeProjectInfo } from "types/project";

import ERR_CODE from "@/core/error-code";
import { sleep } from "common/utils";
import { notification } from "antd";
import { EditorContext } from "@/views/Editor";
import FSWatcherEvent from "common/FileWatcherEvent";

// 获取项目列表
export function useProjectList(): [
  TypeProjectDataDoc[],
  boolean,
  () => Promise<void>
] {
  // 使用机型进行隔离查询
  const [brandConf] = useBrandConf();
  const [value, updateValue] = useState<TypeProjectDataDoc[]>([]);
  const [loading, updateLoading] = useState<boolean>(true);
  const registerCancelToken = useAxiosCanceler();

  const refresh = useCallback(async () => {
    updateLoading(true);
    if (!brandConf) return;
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
  TypeProjectDataDoc | null,
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
export function useProjectData(): TypeProjectDataDoc | null {
  return useEditorSelector(getProjectData);
}

// 获取 工程描述信息
export function useProjectInfo(): TypeProjectInfo | null {
  return useEditorSelector(getProjectInfo);
}

// 获取工程目录
export function useProjectPathname(): string | null {
  return useEditorSelector(getProjectPathname);
}

// 处理工程路径
export function useResolveProjectPath(relativePath = ""): string {
  const projectPathname = useProjectPathname();
  const [projectPath, setProjectPath] = useState("");

  useEffect(() => {
    if (!(projectPathname && relativePath)) return;
    setProjectPath(path.join(projectPathname, relativePath));
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

// project Context hook
export function useProjectContext(): { projectWatcher: FSWatcherEvent } {
  return useContext(EditorContext);
}

// 监听器
export function useProjectWatcher(
  filepath: string,
  callback: (path: string, stats?: Stats) => void
): FSWatcherEvent {
  const { projectWatcher } = useContext(EditorContext);
  useEffect(() => {
    projectWatcher.on(filepath, callback);
    return () => {
      projectWatcher.unListener(filepath);
      projectWatcher.unwatch();
      projectWatcher.close();
    };
  }, []);
  return projectWatcher;
}

// // 添加图片资源映射
// export function useAddImageMapper(): (data: TypeImageMapper) => Promise<void> {
//   const uuid = useSelector(getProjectUUID);
//   const dispatch = useDispatch();
//   // 更新标题
//   return async data => {
//     if (!uuid) throw new Error(ERR_CODE[2001]);
//     const project = await apiAddImageMapper(uuid, data);
//     dispatch(ActionSetProjectData(project));
//   };
// }

// // 删除图片资源映射
// export function useDelImageMapper(): (target: string) => Promise<void> {
//   const uuid = useSelector(getProjectUUID);
//   const dispatch = useDispatch();
//   // 更新标题
//   return async target => {
//     if (!uuid) throw new Error(ERR_CODE[2001]);
//     const project = await apiDelImageMapper(uuid, target);
//     dispatch(ActionSetProjectData(project));
//   };
// }

// // 更新缓存在 state.project.projectData 的所有数据
// export function useUpdateProject(): () => void {
//   const dispatch = useDispatch();
//   const projectData = useSelector(getProjectData);
//   const handleUpdate = () => {
//     if (projectData && projectData.uuid) {
//       updateProject(
//         _.pick(projectData, [
//           "uuid",
//           "brand",
//           "description",
//           "uiVersion",
//           "template",
//           "imageDataList",
//           "imageMapperList"
//         ])
//       ).then(data => {
//         if (!data) {
//           message.error(ERR_CODE[2003]);
//           return;
//         }
//         dispatch(actionSetProject(data));
//       });
//     }
//   };
//   return handleUpdate;
// }
