// selector 返回 [state, setState] 结构的定义
export type TypeSelectorResult<T, R = void> = [T, (data: T) => R];

// 更新 state
export function updateState<T>(oldState: T, newState: T): T {
  return Object.assign({}, oldState, newState);
}
