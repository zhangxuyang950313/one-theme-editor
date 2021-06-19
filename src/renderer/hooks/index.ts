import { Canceler } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getImageByPath, getImageListByPaths } from "@/core/data";
import { InputProps } from "antd";

import { ActionSetWindowTitle } from "@/store/modules/base/action";
import { getWindowTitle } from "@/store/modules/base/selector";

// 设置页面标题
export enum presetTitle {
  default = "一个主题编辑器"
}
export function useDocumentTitle(): [string, typeof setTitleMethod] {
  const dispatch = useDispatch();
  const windowTitle = useSelector(getWindowTitle);
  const setTitleMethod = (title: string) =>
    setTimeout(() => dispatch(ActionSetWindowTitle(title)));
  return [windowTitle, setTitleMethod];
}

// 获取输入的值
type TypeUseInputValueReturn = {
  value: string;
  onChange: InputProps["onChange"];
};
export function useInputValue(initialVal: string): TypeUseInputValueReturn {
  const [value, updateVal] = useState(initialVal);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateVal(event.currentTarget.value);
  };
  return { value, onChange };
}

/**
 * axios 请求取消 hooks
 * @returns 返回一个注册函数用于 axios CancelToken
 */
export function useAxiosCanceler(): (c: Canceler) => void {
  const [canceler, updateCanceler] = useState<Canceler>();
  useEffect(() => () => canceler && canceler("组件销毁，取消请求"), []);
  return (c: Canceler) => updateCanceler(() => c);
}

/**
 * 用于在异步更新数据时组件提前销毁的情况
 * hooks 会在当前组件存活时进行数据更新，调用 updater
 * @returns 返回一个注册函数传入要更新数据的方法
 */
export function useAsyncUpdater(): (updater: () => void) => void {
  const [isDestroyed, updateDestroyed] = useState(false);
  useEffect(() => updateDestroyed(false), []); // 组件初始化
  useEffect(() => () => updateDestroyed(true), []); // 组件销毁

  return (updater: () => void) => {
    if (isDestroyed) return;
    updater();
  };
}

// // 异步从数据库获取缓存的图片
// export function useAsyncImage(file: string): string {
//   const [value, updateVal] = useState<string>("");
//   useLayoutEffect(() => {
//     getImageByPath(file).then(img => {
//       if (!img?.base64) return;
//       updateVal(img.base64);
//     });
//   }, [file]);
//   return value;
// }

// // 异步从数据库获取多个图片
// export function useAsyncImageList(): [
//   (string | null)[],
//   (fileList: string[]) => void
// ] {
//   const [list, updateList] = useState<(string | null)[]>([]);
//   const getImages = (fileList: string[]) => {
//     getImageListByPaths(fileList).then(images => {
//       updateList(images.map(item => item?.base64 || null));
//     });
//   };
//   return [list, getImages];
// }
