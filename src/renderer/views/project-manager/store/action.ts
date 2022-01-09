import type { TypeScenarioOption } from "src/types/config.scenario";

export enum ACTION_TYPES {
  SET_SCENARIO_SELECTED = "SET_SCENARIO_SELECTED" // 当前选择的场景
}

// 设置场景信息
type TypeActionSetScenario = {
  type: typeof ACTION_TYPES.SET_SCENARIO_SELECTED;
  payload: TypeScenarioOption;
};

// main actions
export type TypeStarterActions = TypeActionSetScenario;

// 设置选择的场景信息
export function ActionSetScenario(payload: TypeScenarioOption): TypeActionSetScenario {
  return { type: ACTION_TYPES.SET_SCENARIO_SELECTED, payload };
}
