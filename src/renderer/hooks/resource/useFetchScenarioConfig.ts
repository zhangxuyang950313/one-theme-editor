import { useState, useEffect } from "react";
import { useEditorDispatch } from "@/store/editor";
import { ActionSetScenarioConfig } from "@/store/editor/action";
import { LOAD_STATUS } from "src/enum";
import { TypeScenarioConfig } from "src/types/scenario.config";
import ScenarioConfigData from "src/data/ScenarioConfig";
import ERR_CODE from "src/common/errorCode";

/**
 * 获取当前工程资源配置(projectData.resourceSrc)
 * @returns
 */
export default function useFetchScenarioConfig(
  scenarioSrc: string | undefined,
  callback?: (data: TypeScenarioConfig) => void
): [TypeScenarioConfig, LOAD_STATUS] {
  const dispatch = useEditorDispatch();
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [state, setState] = useState(ScenarioConfigData.default);
  useEffect(() => {
    if (!scenarioSrc) return;
    setStatus(LOAD_STATUS.LOADING);
    window.$server
      .getScenarioConfig(scenarioSrc)
      .then(data => {
        if (!data) throw new Error(ERR_CODE[3002]);
        console.log(`加载场景配置: ${scenarioSrc}`, data);
        dispatch(ActionSetScenarioConfig(data));
        setState(data);
        callback && callback(data);
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(() => {
        setStatus(LOAD_STATUS.FAILED);
      });
  }, [scenarioSrc]);
  return [state, status];
}
