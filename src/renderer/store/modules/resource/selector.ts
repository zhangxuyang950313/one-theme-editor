import { createSelector } from "reselect";
import { TypeStoreState } from "@/store/index";

// 数据
const getResourceState = (state: TypeStoreState) => state.resource;

export const getResourceImageList = createSelector(
  getResourceState,
  state => state.imageList
);

export const findResourceImage = createSelector(
  getResourceState,
  state => (target: string) =>
    state.imageList.find(item => item.target === target)
);
