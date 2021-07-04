import { createStore, combineReducers } from "redux";

// 模块切片
import base from "./modules/base/reducer";

// 合并导出
const GlobalReducers = combineReducers({
  base // 基础数据
});

export default GlobalReducers;

// 分别导出
export const baseStore = createStore(base);
