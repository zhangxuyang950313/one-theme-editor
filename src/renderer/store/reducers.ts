import { createStore, combineReducers } from "redux";

// 模块切片
import baseState from "./modules/base/reducer";
import templateState from "./modules/template/reducer";
import projectState from "./modules/project/reducer";

// 合并导出
const rootReducers = combineReducers({
  baseState, // 基础数据
  templateState, // 模板数据
  projectState // 工程数据
});
export default rootReducers;

// 分别导出
export const baseStore = createStore(baseState);
export const templateStore = createStore(templateState);
export const projectStore = createStore(projectState);
