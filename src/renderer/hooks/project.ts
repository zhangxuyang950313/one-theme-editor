import path from "path";
import { useLayoutEffect, useEffect, useState, useCallback } from "react";
import { apiGetProjectByUUID, apiGetProjectList } from "@/api/index";
import { useAxiosCanceler } from "@/hooks/index";
import {
  useBrandConf,
  useLoadSourceConfig,
  useSourceConfigRoot
} from "@/hooks/source";
import { ActionSetProjectData } from "@/store/editor/action";
import { getProjectData, getProjectPathname } from "@/store/editor/selector";
import { useEditorDispatch, useEditorSelector } from "@/store/index";
import { TypeProjectDataDoc, TypeProjectStateInStore } from "types/project";

import ERR_CODE from "@/core/error-code";
import { notification } from "antd";
import { useDocumentTitle } from "./index";

// 获取项目列表
type TypeIsLoading = boolean;
type TypeRefreshFunc = () => Promise<void>;
type TypeReturnData = [TypeProjectDataDoc[], TypeRefreshFunc, TypeIsLoading];
export function useProjectList(): TypeReturnData {
  // 使用机型进行隔离查询
  const [currentBrand] = useBrandConf();
  const [value, updateValue] = useState<TypeProjectDataDoc[]>([]);
  const [loading, updateLoading] = useState<boolean>(true);
  const registerCancelToken = useAxiosCanceler();

  const refresh = useCallback(async () => {
    updateLoading(true);
    if (!currentBrand) return;
    return apiGetProjectList(currentBrand, registerCancelToken)
      .then(projects => {
        console.log("获取工程列表：", projects);
        updateValue(projects);
      })
      .catch(console.log)
      .finally(() => {
        updateLoading(false);
      });
  }, [currentBrand]);

  useLayoutEffect(() => {
    if (currentBrand) refresh();
  }, [currentBrand, refresh]);
  return [value, refresh, loading];
}

/**
 * 加载工程
 * @param uuid
 * @returns
 */
export function useLoadProjectByUUID(
  uuid: string
): [TypeProjectDataDoc | null, boolean] {
  const [project, updateProject] = useState<TypeProjectDataDoc | null>(null);
  const [loading, updateLoading] = useState(true);
  const dispatch = useEditorDispatch();
  // const registerCancelToken = useAxiosCanceler();

  useLayoutEffect(() => {
    // let cancel;
    console.log(`准备获取工程: ${uuid}`);

    // // 注册 socket
    // socketProject(uuid, project => {
    //   console.log(`更新工程数据 ${uuid}`, project);
    //   updateProject(project);
    //   if (loading) updateLoading(false);
    // });
    // socketResource(uuid, project => {
    //   updateProject(project);
    // });
    apiGetProjectByUUID(uuid)
      .then(project => {
        if (!project) return;
        console.log(`载入工程：: ${uuid}`, project);
        updateProject(project);
        dispatch(ActionSetProjectData(project));
      })
      .catch(err => {
        console.warn(`${ERR_CODE[2005]}: ${uuid}`, err);
        notification.error({ message: ERR_CODE[2005], description: uuid });
        updateProject(null);
      })
      .finally(() => {
        updateLoading(false);
      });
    // return cancel;
  }, [uuid]);
  useLoadSourceConfig();
  return [project, loading];
}

// 获取当前工程数据
export function useProjectData(): TypeProjectStateInStore | null {
  const [, updateTitle] = useDocumentTitle();
  const projectData = useEditorSelector(getProjectData);
  if (projectData?.projectInfo?.name) {
    updateTitle(projectData.projectInfo.name);
  }
  return projectData;
}

// 获取当前工程目录
export function useProjectPathname(): string | null {
  return useEditorSelector(getProjectPathname);
}

// 处理工程路径
export function useResolveProjectPath(
  relativePath = ""
): [string, (x: string) => void] {
  const projectPathname = useProjectPathname();
  const [relativeVal, setRelativeVal] = useState(relativePath);
  const [projectPath, setProjectPath] = useState("");

  useEffect(() => {
    if (!(projectPathname && relativePath)) return;
    setProjectPath(path.join(projectPathname, relativePath));
  }, [relativeVal]);

  return [projectPath, setRelativeVal];
}

// 处理素材路径
export function useResolveSourcePath(
  relativePath: string
): [string, (x: string) => void] {
  const sourceRoot = useSourceConfigRoot();
  const [relativeVal, setRelativeVal] = useState(relativePath);
  const [sourcePath, setSourcePath] = useState("");

  useEffect(() => {
    if (!sourceRoot || !relativePath) return;
    setSourcePath(path.join(sourceRoot, relativePath));
  }, [relativeVal]);

  return [sourcePath, setRelativeVal];
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
