import path from "path";
import { useState, useEffect } from "react";
import { notification } from "antd";
import { apiGetResourcePageConfData } from "@/request";
import { useEditorDispatch, useEditorSelector } from "@/store";
import { ActionPatchPageConfMap } from "@/store/editor/action";
import { TypeResourcePageConf } from "src/types/resource";
import { LOAD_STATUS } from "src/enum";
import { asyncQueue } from "src/utils";

/**
 * 获取当前工程当前模块的页面列表
 * @returns
 */
export default function useFetchPageConfList(): [
  TypeResourcePageConf[],
  LOAD_STATUS,
  () => Promise<void>
] {
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [pageData, setPageData] = useState<TypeResourcePageConf[]>([]);
  const dispatch = useEditorDispatch();
  const resourceSrc = useEditorSelector(state => state.projectData.resourceSrc);
  const groupList = useEditorSelector(
    state => state.currentModuleConfig.groupList || []
  );

  const handleFetch = async (changeStatus = true) => {
    if (!resourceSrc) return;
    const pageConfDataQueue = groupList
      .flatMap(item => item.pageList)
      .map(item => async () => {
        const data = await apiGetResourcePageConfData({
          namespace: path.dirname(resourceSrc),
          config: item.src
        });
        dispatch(ActionPatchPageConfMap(data));
        return data;
      });
    changeStatus && setStatus(LOAD_STATUS.LOADING);
    return asyncQueue(pageConfDataQueue)
      .then(data => {
        setPageData(data);
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(err => {
        notification.error({ message: err.message });
        setStatus(LOAD_STATUS.FAILED);
      });
  };

  useEffect(() => {
    handleFetch(false).catch(err => {
      notification.error({ message: err.message });
    });
  }, [groupList]);
  return [pageData, status, handleFetch];
}
