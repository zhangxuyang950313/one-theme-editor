import { useCallback, useLayoutEffect, useState } from "react";
// import { getImageByPath, getImageListByPaths } from "@/core/data";
import { InputProps } from "antd";

// 设置页面标题
const tt = {
  main: "一个主题编辑器"
};
export function useDocumentTitle(): [
  string,
  (title: string) => void,
  (k: keyof typeof tt) => void
] {
  const setTitle = (title: string) => {
    document.title = title;
  };
  const setPreset = (name: "main") => {
    setTitle(tt[name] || "");
  };
  return [document.title, setTitle, setPreset];
}

// 获取输入的值
type TypeUseInputValueReturn = {
  value: string;
  onChange: InputProps["onChange"];
};
export function useInputValue(initialValue: string): TypeUseInputValueReturn {
  const [value, setValue] = useState(initialValue);
  const onInputChange: InputProps["onChange"] = event => {
    setValue(event.currentTarget.value);
  };
  const onChange = useCallback(onInputChange, []);
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
