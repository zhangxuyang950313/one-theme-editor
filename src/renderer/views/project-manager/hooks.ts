import { TypeResourceConfig } from "src/types/resource.config";
import { TypeScenarioOption } from "src/types/scenario.config";
import { useProjectManagerSelector } from "./store";

export function useScenarioSelected(): TypeScenarioOption {
  return useProjectManagerSelector(state => state.scenarioSelected);
}

export function useResourceConfigList(): TypeResourceConfig[] {
  return useProjectManagerSelector(
    state => state.scenarioSelected.resourceConfigList
  );
}
