import { useDispatch, useSelector } from "react-redux";
import { useLayoutEffect, useState, useCallback } from "react";
import { getProjectById } from "@/api/index";
import { getProjectPreviewConf } from "@/store/modules/project/selector";
// import {
//   initProject,
//   setProjectBrandInfo,
//   setProjectDescInfo,
//   setProjectPreviewConf,
//   setProjectPageConfData,
//   setProjectTempConf,
//   setProjectUiVersion
// } from "@/store/modules/project/action";
import {
  TypeBrandConf,
  TypeDatabase,
  TypeTemplateConf,
  TypeProjectData
} from "src/types/project";
import { getProjectList } from "@/api";

// 获取项目列表
type TypeIsLoading = boolean;
type TypeRefreshFn = () => Promise<void>;
type TypeProjectDataInDoc = TypeDatabase<TypeProjectData>;
export function useProjectList(
  brandInfo: TypeBrandConf
): [TypeProjectDataInDoc[], TypeRefreshFn, TypeIsLoading] {
  const [value, updateValue] = useState<TypeProjectDataInDoc[]>([]);
  const [loading, updateLoading] = useState<boolean>(true);
  const refresh = useCallback(async () => {
    updateLoading(true);
    setTimeout(async () => {
      const projects = await getProjectList(brandInfo);
      console.log("获取工程列表：", projects);
      updateValue(projects);
      updateLoading(false);
    }, 300);
  }, [brandInfo]);
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
  projectData: TypeProjectData | null | undefined
): TypeProjectData | null | undefined {
  const [data, updateData] = useState(projectData);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (!projectData) return;
    updateData(projectData);
  }, [projectData]);

  useLayoutEffect(() => {
    console.log("载入工程：", data);
    if (!data) return;
    // dispatch(initProject()); // 避免快速切换工程的内存泄漏
    // dispatch(setProjectBrandInfo(data.brandInfo));
    // dispatch(setProjectUiVersion(data.uiVersion));
    // dispatch(setProjectDescInfo(data.projectInfo));
    // dispatch(setProjectTempConf(data.templateConf));
    // dispatch(setProjectPreviewConf(data.previewConf));
    // dispatch(setProjectPageConfData(data.pageConfData));
  }, [data, dispatch]);
  return data;
}

// 工程预览所需配置
export function usePreviewConf(): TypeTemplateConf | null {
  return useSelector(getProjectPreviewConf);
}
