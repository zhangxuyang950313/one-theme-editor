import path from "path";
import { useState, useEffect } from "react";
import { notification } from "antd";
import { apiGetSourcePageConfData } from "@/request";
import { useEditorDispatch } from "@/store";
import { ActionPatchPageDataMap } from "@/store/editor/action";
import { TypeSourcePageConf } from "src/types/source";
import { LOAD_STATUS } from "src/enum";
import { asyncQueue } from "src/utils";
import { useSourcePageGroupList, useSourceConfigPath } from ".";

/**
 * 获取当前工程当前模块的页面列表
 * @returns
 */
export default function useFetchPageConfList(): [
  TypeSourcePageConf[],
  LOAD_STATUS,
  () => Promise<void>
] {
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [pageData, setPageData] = useState<TypeSourcePageConf[]>([]);
  const dispatch = useEditorDispatch();
  const pageGroupList = useSourcePageGroupList();
  const sourceConfigPath = useSourceConfigPath();

  const handleFetch = async (changeStatus = true) => {
    if (!sourceConfigPath) return;
    const pageConfDataQueue = pageGroupList
      .flatMap(item => item.pageList)
      .map(item => async () => {
        const data = await apiGetSourcePageConfData({
          namespace: path.dirname(sourceConfigPath),
          config: item.src
        });
        dispatch(ActionPatchPageDataMap(data));
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
  }, [pageGroupList]);
  return [pageData, status, handleFetch];
}
