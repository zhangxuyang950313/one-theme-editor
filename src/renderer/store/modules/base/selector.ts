import { createSelector } from "reselect";
import { TypeStoreState } from "../../index";

// 基础通用数据
const getBaseState = (state: TypeStoreState) => state.base;

// 获取当前服务端口
export const getServerPort = createSelector(getBaseState, state => state.port);
