import { createStore, combineReducers } from "redux";

// 模块切片
import base from "./modules/base/reducer";
import template from "./modules/template/reducer";
import project from "./modules/project/reducer";

// 合并导出
const rootReducers = combineReducers({
  base, // 基础数据
  template, // 模板数据
  project // 工程数据
});
export default rootReducers;

// 分别导出
export const baseStore = createStore(base);
export const templateStore = createStore(template);
export const projectStore = createStore(project);
