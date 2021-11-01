import { useState, useEffect } from "react";
import { ScenarioOption } from "src/data/ScenarioConfig";
import { TypeScenarioOption } from "src/types/scenario.config";

export default function useFetchScenarioOption(
  scenarioMd5: string
): [TypeScenarioOption] {
  const [state, setState] = useState<TypeScenarioOption>(
    ScenarioOption.default
  );
  useEffect(() => {
    if (!scenarioMd5) return;
    window.$server.getScenarioOption(scenarioMd5).then(option => {
      console.log("获取场景选项", option);
      setState(option);
    });
  }, [scenarioMd5]);
  return [state];
}
