import React from "react";
// import fse from "fs-extra";
import { useLoadImageByPath } from "@/hooks/image";

/**
 * 封装 img
 * 用于显示本地路径的图片
 * @param props 和 img 标签具有相同的属性
 */
const LocalImage: React.FC<JSX.IntrinsicElements["img"]> = props => {
  const [url] = useLoadImageByPath(props.src);
  const show = url && props.src;
  // 判断交给服务进程去做
  // &&
  // fse.existsSync(props.src) &&
  // fse.statSync(props.src).isFile();
  return show ? <img {...props} src={url} alt={props.src} /> : null;
};

export default LocalImage;