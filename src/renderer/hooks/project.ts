import { useDispatch, useSelector } from "react-redux";
import { useLayoutEffect, useState, useCallback } from "react";
import { getProjectById, getProjectsByBrand } from "@/core/data";
import {
  getImageDataByKey,
  getProjectPreviewConf
} from "@/store/modules/project/selector";
import {
  TypeBrandInfo,
  TypeDatabase,
  TypePreviewConf,
  TypePreviewData,
  TypeProjectData
} from "@/types/project";
import {
  initProject,
  setProjectBrandInfo,
  setProjectDescInfo,
  setProjectPreviewConf,
  setProjectPreviewData,
  setProjectTempConf,
  setProjectUiVersion
} from "@/store/modules/project/action";

// 获取项目列表
type TypeIsLoading = boolean;
type TypeRefreshFn = () => Promise<void>;
type TypeProjectDataInDoc = TypeDatabase<TypeProjectData>;
export function useProjectList(
  brandInfo: TypeBrandInfo
): [TypeProjectDataInDoc[], TypeRefreshFn, TypeIsLoading] {
  const [value, updateValue] = useState<TypeProjectDataInDoc[]>([]);
  const [loading, updateLoading] = useState<boolean>(true);
  const refresh = useCallback(async () => {
    updateLoading(true);
    setTimeout(async () => {
      const projects = await getProjectsByBrand(brandInfo);
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
    getProjectById(id)
      .then(project => {
        console.log(`获取工程${id}：`, project);
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
    const previewData: TypePreviewData = {
      imageData: data.imageData,
      pageConfData: data.pageConfData
    };
    dispatch(initProject()); // 避免快速切换工程的内存泄漏
    dispatch(setProjectBrandInfo(data.brandInfo));
    dispatch(setProjectUiVersion(data.uiVersion));
    dispatch(setProjectDescInfo(data.projectInfo));
    dispatch(setProjectTempConf(data.templateConf));
    dispatch(setProjectPreviewConf(data.previewConf));
    dispatch(setProjectPreviewData(previewData));
  }, [data, dispatch]);
  return data;
}

// 工程预览所需配置
export function usePreviewConf(): TypePreviewConf | null {
  return useSelector(getProjectPreviewConf);
}

// 获取图片信息
export function useGetImageDataByKey(): ReturnType<typeof getImageDataByKey> {
  return useSelector(getImageDataByKey);
}
