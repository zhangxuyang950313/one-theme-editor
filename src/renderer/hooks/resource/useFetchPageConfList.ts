import path from "path";
import { useEffect } from "react";
import { Notification } from "@arco-design/web-react";
import { LOAD_STATUS } from "src/enum";
import { TypePageConfig } from "src/types/resource.config";
import { asyncQueue } from "src/common/utils";
import { ActionPatchPageConfMap } from "@/store/editor/action";
import { useEditorDispatch } from "@/store/editor";
import { useCreatePromiseHook } from "../index";

/**
 * 获取当前工程当前模块的页面列表
 * @returns
 */
export default function useFetchPageConfList(
  resourceSrc: string,
  pageSrcList: string[]
): [TypePageConfig[], LOAD_STATUS, () => Promise<TypePageConfig[]>] {
  const dispatch = useEditorDispatch();

  const [pageConfigList, status, handleFetch] =
    useCreatePromiseHook(async () => {
      if (!resourceSrc) return [];
      const pageConfDataQueue = pageSrcList.map(item => async () => {
        const data = await window.$server.getPageConfigList({
          namespace: path.dirname(resourceSrc),
          config: item
        });
        dispatch(ActionPatchPageConfMap(data));
        return data;
      });
      const data = asyncQueue(pageConfDataQueue).catch(err => {
        Notification.error({ content: err.message });
        return [];
      });
      return data;
    }, []);

  useEffect(() => {
    if (!resourceSrc) return;
    handleFetch();
  }, [resourceSrc]);

  return [pageConfigList, status, handleFetch];
}
