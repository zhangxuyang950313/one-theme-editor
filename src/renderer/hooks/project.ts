import { useLayoutEffect, useState, useCallback } from "react";
import { getProjectById, getProjectsByBrand } from "@/core/data";
import { TypeBrandInfo, TypeDatabase, TypeProjectData } from "@/types/project";

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
      updateValue(projects);
      updateLoading(false);
    }, 300);
  }, [brandInfo]);
  useLayoutEffect(() => {
    refresh();
  }, [refresh]);
  return [value, refresh, loading];
}

// 使用 id 获取项目信息
export function useProjectById(id: string): TypeProjectDataInDoc | null {
  const [value, updateValue] = useState<TypeProjectDataInDoc | null>(null);
  useLayoutEffect(() => {
    getProjectById(id).then(project => {
      if (project) updateValue(project);
    });
  }, [id]);
  return value;
}
