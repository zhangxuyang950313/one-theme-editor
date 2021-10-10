import { notification } from "antd";
import { useState, useCallback, useEffect } from "react";
import { apiGetScenarioConfig } from "@/request";
import { useEditorDispatch, useEditorSelector } from "@/store";
import { ActionSetScenarioConfig } from "@/store/editor/action";
import { LOAD_STATUS } from "src/enum";
import { TypeScenarioConfig } from "src/types/resource.config";
import ScenarioConfigData from "src/data/ScenarioConfig";
import ERR_CODE from "src/constant/errorCode";

/**
 * 获取当前工程资源配置(projectData.resourceSrc)
 * @returns
 */
export default function useFetchScenarioConfig(): [
  TypeScenarioConfig,
  LOAD_STATUS,
  () => Promise<void>
] {
  const dispatch = useEditorDispatch();
  const scenarioSrc = useEditorSelector(state => state.projectData.scenarioSrc);
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [scenarioConfig, setScenarioConfig] = useState(
    ScenarioConfigData.default
  );
  const doFetchData = useCallback(async () => {
    if (!scenarioSrc) return;
    setStatus(LOAD_STATUS.LOADING);
    apiGetScenarioConfig(scenarioSrc)
      .then(data => {
        if (!data) throw new Error(ERR_CODE[3002]);
        console.log(`加载场景配置: ${scenarioSrc}`, data);
        dispatch(ActionSetScenarioConfig(data));
        setScenarioConfig(data);
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(() => {
        setStatus(LOAD_STATUS.FAILED);
      });
  }, [scenarioSrc]);
  useEffect(() => {
    doFetchData().catch(err => {
      notification.error({ message: err.message });
    });
  }, [scenarioSrc]);
  return [scenarioConfig, status, doFetchData];
}
