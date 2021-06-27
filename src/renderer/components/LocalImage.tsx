import React from "react";
import fse from "fs-extra";
import { useImageUrl } from "@/hooks";

/**
 * 封装 img
 * 用于显示本地路径的图片
 * @param props 和 img 标签具有相同的属性
 */
const LocalImage: React.FC<JSX.IntrinsicElements["img"]> = props => {
  const imgURL = useImageUrl(props.src);
  const show =
    imgURL &&
    props.src &&
    fse.existsSync(props.src) &&
    fse.statSync(props.src).isFile();
  return show ? <img {...props} src={imgURL} alt={props.src} /> : null;
};

export default LocalImage;
