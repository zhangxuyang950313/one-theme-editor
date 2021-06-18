import { useCallback, useState } from "react";
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
