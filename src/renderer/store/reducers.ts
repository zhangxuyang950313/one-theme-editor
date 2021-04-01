import { createStore, combineReducers } from "redux";

// 模块切片
import baseState from "./modules/base/reducer";
import normalizedState from "./modules/normalized/reducer";

// 合并导出
const rootReducers = combineReducers({ baseState, normalizedState });
export default rootReducers;

// 分别导出
export const baseStore = createStore(baseState);
export const normalized = createStore(normalizedState);
