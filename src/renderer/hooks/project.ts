import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useLayoutEffect, useState, useCallback } from "react";
import { getProjectById, updateProjectById, getProjectList } from "@/api/index";
import { TypeDatabase, TypeProjectData } from "types/project";
import { useSelectedBrand } from "@/hooks/template";
import {
  setProject,
  updateSelectedModule,
  updateSelectedPage
} from "@/store/modules/project/action";
import { getProjectData } from "@/store/modules/project/selector";

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
  id: string
): [TypeProjectDataInDoc | null, boolean] {
  const [value, updateValue] = useState<TypeProjectDataInDoc | null>(null);
  const [loading, updateLoading] = useState(true);

  useLayoutEffect(() => {
    console.log(`准备获取工程（${id}）`);
    getProjectById(id)
      .then(async project => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return project;
      })
      .then(project => {
        console.log(`获取工程（${id}）成功`, project);
        updateValue(project);
      })
      .catch(err => {
        console.warn(`获取工程（${id}）失败`, err);
        updateValue(null);
      })
      .finally(() => {
        updateLoading(false);
      });
  }, [id]);
  return [value, loading];
}

// 载入工程
export function useLoadProject(
  projectData: TypeDatabase<TypeProjectData> | null | undefined
): void {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (!projectData) return;
    console.log("载入工程：", projectData);
    dispatch(setProject(projectData));
    const firstModule = projectData?.template.modules[0];
    const firstPage = firstModule?.groups[0].pages[0];
    if (firstModule) dispatch(updateSelectedModule(firstModule));
    if (firstPage) dispatch(updateSelectedPage(firstPage));
  }, [dispatch, projectData]);
}

export function useUpdateProject(): () => void {
  const dispatch = useDispatch();
  const projectData = useSelector(getProjectData);
  const handleUpdate = () => {
    if (projectData && projectData._id) {
      updateProjectById(
        projectData._id,
        _.pick(projectData, ["brand", "projectInfo", "uiVersion", "template"])
      ).then(data => {
        dispatch(setProject(data));
      });
    }
  };
  return handleUpdate;
}
