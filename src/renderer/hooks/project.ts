import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useLayoutEffect, useState, useCallback } from "react";
import { message } from "antd";
import { getProjectByUUID, updateProject, getProjectList } from "@/api/index";
import { useSelectedBrand } from "@/hooks/template";

import { actionSetProject } from "@/store/modules/project/action";
import { getProjectData } from "@/store/modules/project/selector";
import {
  setSelectedModule,
  setSelectedPage
} from "@/store/modules/template/action";
import { TypeDatabase, TypeProjectData } from "types/project";

import ERR_CODE from "renderer/core/error-code";

// 获取项目列表
type TypeIsLoading = boolean;
type TypeRefreshFn = () => Promise<void>;
type TypeProjectDataInDoc = TypeDatabase<TypeProjectData>;
type TypeReturnData = [TypeProjectDataInDoc[], TypeRefreshFn, TypeIsLoading];

export function useProjectList(): TypeReturnData {
  // 使用机型进行隔离查询
  const currentBrandInfo = useSelectedBrand();
  const [value, updateValue] = useState<TypeProjectDataInDoc[]>([]);
  const [loading, updateLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    updateLoading(true);
    setTimeout(async () => {
      if (!currentBrandInfo) return;
      const projects = await getProjectList(currentBrandInfo);
      console.log("获取工程列表：", projects);
      updateValue(projects);
      updateLoading(false);
    }, 300);
  }, [currentBrandInfo]);
  useLayoutEffect(() => {
    refresh();
  }, [refresh]);
  return [value, refresh, loading];
}

// 使用 id 获取工程信息
export function useProjectById(
  uuid: string
): [TypeProjectDataInDoc | null, boolean] {
  const [project, updateProject] = useState<TypeProjectDataInDoc | null>(null);
  const [loading, updateLoading] = useState(true);
  useLayoutEffect(() => {
    console.log(`准备获取工程（${uuid}）`);
    getProjectByUUID(uuid)
      .then(async project => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return project;
      })
      .then(project => {
        console.log(`获取工程（${uuid}）成功`, project);
        updateProject(project);
      })
      .catch(err => {
        console.warn(`获取工程（${uuid}）失败`, err);
      })
      .finally(() => {
        updateLoading(false);
      });
  }, [uuid]);
  return [project, loading];
}

// 载入工程，即将 projectData 载入 redux
export function useLoadProject(projectData: TypeProjectDataInDoc | null): void {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (!projectData) return;
    console.log("载入工程：", projectData);
    dispatch(actionSetProject(projectData));
    // 默认选择第一个模块和第一个页面
    const firstModule = projectData?.template?.modules[0];
    const firstPage = firstModule?.groups[0].pages[0];
    if (firstModule) dispatch(setSelectedModule(firstModule));
    if (firstPage) dispatch(setSelectedPage(firstPage));
  }, [dispatch, projectData]);
}

// 获取当前工程数据
export function useProjectData(): [
  TypeProjectDataInDoc | null,
  (data: TypeProjectDataInDoc) => void
] {
  const dispatch = useDispatch();
  return [
    useSelector(getProjectData),
    data => dispatch(actionSetProject(data))
  ];
}

// 更新缓存在 state.project.projectData 的所有数据
export function useUpdateProject(): () => void {
  const dispatch = useDispatch();
  const projectData = useSelector(getProjectData);
  const handleUpdate = () => {
    if (projectData && projectData.uuid) {
      updateProject(
        _.pick(projectData, [
          "uuid",
          "brand",
          "description",
          "uiVersion",
          "template",
          "imageDataList",
          "imageMapperList"
        ])
      ).then(data => {
        if (!data) {
          message.error(ERR_CODE[2003]);
          return;
        }
        dispatch(actionSetProject(data));
      });
    }
  };
  return handleUpdate;
}
