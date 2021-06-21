import { useLayoutEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socketProject, socketSyncResource } from "@/api/socket";
import {
  apiAddImageMapper,
  apiDelImageMapper,
  apiGetProjectList
} from "@/api/index";
import { useAxiosCanceler } from "@/hooks/index";
import { useSelectedBrand } from "@/hooks/template";
import {
  ActionSetCurrentBrand,
  ActionSetCurrentPage,
  ActionSetCurrentTemplate
} from "@/store/modules/template/action";
import { ActionSetProjectData } from "@/store/modules/project/action";
import {
  getProjectData,
  getProjectUUID
} from "@/store/modules/project/selector";
import {
  TypeImageMapper,
  TypeProjectDataDoc,
  TypeProjectStateInStore
} from "types/project";

import ERR_CODE from "renderer/core/error-code";
import { useDocumentTitle } from "./index";

// 获取项目列表
type TypeIsLoading = boolean;
type TypeRefreshFunc = () => Promise<void>;
type TypeReturnData = [TypeProjectDataDoc[], TypeRefreshFunc, TypeIsLoading];
export function useProjectList(): TypeReturnData {
  // 使用机型进行隔离查询
  const selectedBrand = useSelectedBrand();
  const [value, updateValue] = useState<TypeProjectDataDoc[]>([]);
  const [loading, updateLoading] = useState<boolean>(true);
  const registerCancelToken = useAxiosCanceler();

  const refresh = useCallback(async () => {
    updateLoading(true);
    if (!selectedBrand) return;
    return apiGetProjectList(selectedBrand, registerCancelToken)
      .then(projects => {
        console.log("获取工程列表：", projects);
        updateValue(projects);
      })
      .catch(console.log)
      .finally(() => {
        updateLoading(false);
      });
  }, [selectedBrand]);

  useLayoutEffect(() => {
    if (selectedBrand) refresh();
  }, [selectedBrand, refresh]);
  return [value, refresh, loading];
}

// 载入工程，将 projectData 载入 redux
export function useLoadProject(project: TypeProjectDataDoc | null): void {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (!project) return;
    console.log("载入工程：", project);
    dispatch(ActionSetProjectData(project));
    dispatch(ActionSetCurrentTemplate(project.template));
    // 默认选择第一个模块和第一个页面
    const firstModule = project?.template?.modules[0];
    const firstPage = firstModule?.groups[0].pages[0];
    if (firstModule) dispatch(ActionSetCurrentBrand(firstModule));
    if (firstPage) dispatch(ActionSetCurrentPage(firstPage));
  }, [dispatch, project]);
}

/**
 * 安装工程，传入 uuid，从数据库中查找后调用 useLoadProject 载入
 * @param uuid
 * @returns
 */
export function useLoadProjectByUUID(
  uuid: string
): [TypeProjectDataDoc | null, boolean] {
  const [project, updateProject] = useState<TypeProjectDataDoc | null>(null);
  const [loading, updateLoading] = useState(true);
  // const registerCancelToken = useAxiosCanceler();

  useLayoutEffect(() => {
    // let cancel;
    console.log(`准备获取工程（${uuid}）`);

    // 注册 socket
    socketProject(uuid, project => {
      console.log(`更新工程数据 ${uuid}`, project);
      updateProject(project);
      if (loading) updateLoading(false);
    });
    socketSyncResource(uuid, project => {
      updateProject(project);
    });
    // getProjectByUUID(uuid)
    //   .then(project => {
    //     console.log(`获取工程（${uuid}）成功`, project);
    //     updateProject(project);
    //     registerSocket.project(project => {
    //       console.log(`更新工程数据 ${uuid}`, project);
    //       updateProject(project);
    //     });
    //   })
    //   .catch(err => {
    //     console.warn(`获取工程（${uuid}）失败`, err);
    //   })
    //   .finally(() => {
    //     updateLoading(false);
    //   });
    // return cancel;
  }, [uuid]);
  useLoadProject(project);
  return [project, loading];
}

// 获取当前工程数据
export function useProjectData(): TypeProjectStateInStore | null {
  const [, updateTitle] = useDocumentTitle();
  const projectData = useSelector(getProjectData);
  if (projectData?.description?.name) {
    updateTitle(projectData.description.name);
  }
  return projectData;
}

// 添加图片资源映射
export function useAddImageMapper(): (data: TypeImageMapper) => Promise<void> {
  const uuid = useSelector(getProjectUUID);
  const dispatch = useDispatch();
  // 更新标题
  return async data => {
    if (!uuid) throw new Error(ERR_CODE[2004]);
    const project = await apiAddImageMapper(uuid, data);
    dispatch(ActionSetProjectData(project));
  };
}

// 删除图片资源映射
export function useDelImageMapper(): (target: string) => Promise<void> {
  const uuid = useSelector(getProjectUUID);
  const dispatch = useDispatch();
  // 更新标题
  return async target => {
    if (!uuid) throw new Error(ERR_CODE[2004]);
    const project = await apiDelImageMapper(uuid, target);
    dispatch(ActionSetProjectData(project));
  };
}

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
