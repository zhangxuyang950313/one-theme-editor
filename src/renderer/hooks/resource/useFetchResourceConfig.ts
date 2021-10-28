import { notification } from "antd";
import { useState, useCallback, useEffect } from "react";
import { useEditorDispatch, useEditorSelector } from "@/store/editor";
import { ActionSetResourceConfig } from "@/store/editor/action";
import { LOAD_STATUS } from "src/enum";
import { TypeResourceConfig } from "src/types/resource.config";
import ResourceConfigData from "src/data/ResourceConfig";
import ERR_CODE from "src/constant/errorCode";

/**
 * 获取当前工程资源配置(projectData.resourceSrc)
 * @returns
 */
export default function useFetchResourceConfig(): [
  TypeResourceConfig,
  LOAD_STATUS,
  () => Promise<void>
] {
  const dispatch = useEditorDispatch();
  const resourceSrc = useEditorSelector(state => state.projectData.resourceSrc);
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [resConfig, setResConfig] = useState(ResourceConfigData.default);
  const doFetchData = useCallback(async () => {
    if (!resourceSrc) return;
    setStatus(LOAD_STATUS.LOADING);
    window.$server
      .getResourceConfig(resourceSrc)
      .then(data => {
        if (!data) throw new Error(ERR_CODE[3002]);
        console.log(`加载资源配置: ${resourceSrc}`, data);
        dispatch(ActionSetResourceConfig(data));
        setResConfig(data);
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(() => {
        setStatus(LOAD_STATUS.FAILED);
      });
  }, [resourceSrc]);
  useEffect(() => {
    doFetchData().catch(err => {
      notification.error({ message: err.message });
    });
  }, [resourceSrc]);
  return [resConfig, status, doFetchData];
}
