import { LOAD_STATUS } from "src/enum";
import { useState, useEffect, useCallback } from "react";
import useFetchResourceConfig from "../resource/useFetchResourceConfig";
import useFetchScenarioConfig from "../resource/useFetchScenarioConfig";
import useFetchProjectData from "./useFetchProjectData";

export default function useFetchProject(uuid: string) {
  const [projectData] = useFetchProjectData(uuid);
  const [resourceConfig] = useFetchResourceConfig(projectData?.resourceSrc);
  const [scenarioConfig] = useFetchScenarioConfig(projectData?.scenarioSrc);

  useEffect(() => {
    if (!projectData) return;
    if (!projectData.resourceSrc) {
      throw new Error(`${uuid}: 没有资源配置信息`);
    }
  }, [projectData?.resourceSrc]);
}
