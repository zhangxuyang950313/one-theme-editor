import { useEffect, useState, useCallback } from "react";
import { getProjectsByBrand } from "@/core/data";
import { TypeBrandInfo, TypeProjectInfo } from "@/types/project";

// 获取项目列表
type TypeIsLoading = boolean;
type TypeRefreshFn = () => Promise<void>;
export function useProjectList(
  brandInfo: TypeBrandInfo
): [TypeProjectInfo[], TypeRefreshFn, TypeIsLoading] {
  const [value, updateValue] = useState<TypeProjectInfo[]>([]);
  const [loading, updateLoading] = useState<boolean>(true);
  const refresh = useCallback(async () => {
    updateLoading(true);
    const projects = await getProjectsByBrand(brandInfo);
    updateValue(projects.map(item => item.projectInfo));
    updateLoading(false);
  }, [brandInfo]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return [value, refresh, loading];
}
