import { useState, useEffect } from "react";
import { ScenarioOption } from "src/data/ScenarioConfig";
import { TypeScenarioOption } from "src/types/scenario.config";

export default function useFetchScenarioOption(
  scenarioSrc: string
): [TypeScenarioOption] {
  const [state, setState] = useState<TypeScenarioOption>(
    ScenarioOption.default
  );
  useEffect(() => {
    if (!scenarioSrc) return;
    window.$server.getScenarioOption(scenarioSrc).then(option => {
      console.log("获取场景选项", option);
      setState(option);
    });
  }, [scenarioSrc]);
  return [state];
}
