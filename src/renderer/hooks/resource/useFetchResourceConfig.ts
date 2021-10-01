import { notification } from "antd";
import { useState, useCallback, useEffect } from "react";
import { apiGetResourceConfig } from "@/request";
import { useEditorDispatch } from "@/store";
import { ActionSetResourceConfig } from "@/store/editor/action";
import { LOAD_STATUS } from "src/enum";
import { TypeResourceConfig } from "src/types/resource";
import ResourceConfigData from "src/data/ResourceConfig";
import ERR_CODE from "src/common/errorCode";
import { useResourceConfigPath } from "./index";

/**
 * 获取当前工程资源配置(projectData.resourceConfigPath)
 * @returns
 */
export default function useFetchResourceConfig(): [
  TypeResourceConfig,
  LOAD_STATUS,
  () => Promise<void>
] {
  const dispatch = useEditorDispatch();
  const resourceConfigPath = useResourceConfigPath();
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [resourceConfig, setResourceConfig] = useState(
    ResourceConfigData.default
  );
  const doFetchData = useCallback(async () => {
    if (!resourceConfigPath) return;
    setStatus(LOAD_STATUS.LOADING);
    apiGetResourceConfig(resourceConfigPath)
      .then(data => {
        if (!data) throw new Error(ERR_CODE[3002]);
        console.log(`加载资源配置: ${resourceConfigPath}`, data);
        dispatch(ActionSetResourceConfig(data));
        setResourceConfig(data);
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(() => {
        setStatus(LOAD_STATUS.FAILED);
      });
  }, [resourceConfigPath]);
  useEffect(() => {
    doFetchData().catch(err => {
      notification.error({ message: err.message });
    });
  }, [resourceConfigPath]);
  return [resourceConfig, status, doFetchData];
}
