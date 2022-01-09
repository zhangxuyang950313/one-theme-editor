import { useProjectManagerSelector } from "./store";

import type { TypeResourceConfig } from "src/types/config.resource";
import type { TypeScenarioOption } from "src/types/config.scenario";

export function useScenarioSelected(): TypeScenarioOption {
  return useProjectManagerSelector(state => state.scenarioSelected);
}

export function useResourceConfigList(): TypeResourceConfig[] {
  return useProjectManagerSelector(state => state.scenarioSelected.resourceConfigList);
}
