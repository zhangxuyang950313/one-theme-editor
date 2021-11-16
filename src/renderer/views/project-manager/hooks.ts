import { TypeResourceConfig } from "src/types/config.resource";
import { TypeScenarioOption } from "src/types/config.scenario";

import { useProjectManagerSelector } from "./store";

export function useScenarioSelected(): TypeScenarioOption {
  return useProjectManagerSelector(state => state.scenarioSelected);
}

export function useResourceConfigList(): TypeResourceConfig[] {
  return useProjectManagerSelector(
    state => state.scenarioSelected.resourceConfigList
  );
}
