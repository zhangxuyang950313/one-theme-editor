import { notification } from "antd";
import { useState, useCallback, useEffect } from "react";
import { apiGetSourceConfig } from "@/request";
import { useEditorDispatch } from "@/store";
import { ActionSetSourceConfig } from "@/store/editor/action";
import { LOAD_STATUS } from "src/enum";
import { TypeSourceConfig } from "src/types/source";
import SourceConfig from "src/data/SourceConfig";
import ERR_CODE from "src/common/errorCode";
import { useSourceConfigPath } from ".";

/**
 * 获取资源配置
 * @returns
 */
export default function useFetchSourceConfig(): [
  TypeSourceConfig,
  LOAD_STATUS,
  () => Promise<void>
] {
  const dispatch = useEditorDispatch();
  const sourceConfigPath = useSourceConfigPath();
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [sourceConfig, setSourceConfig] = useState(SourceConfig.default);
  const doFetchData = useCallback(async () => {
    if (!sourceConfigPath) return;
    setStatus(LOAD_STATUS.LOADING);
    apiGetSourceConfig(sourceConfigPath)
      .then(data => {
        if (!data) throw new Error(ERR_CODE[3002]);
        console.log(`加载资源配置: ${sourceConfigPath}`, data);
        dispatch(ActionSetSourceConfig(data));
        setSourceConfig(data);
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(() => {
        setStatus(LOAD_STATUS.FAILED);
      });
  }, [sourceConfigPath]);
  useEffect(() => {
    doFetchData().catch(err => {
      notification.error({ message: err.message });
    });
  }, [sourceConfigPath]);
  return [sourceConfig, status, doFetchData];
}
