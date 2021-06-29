import React from "react";
import fse from "fs-extra";
import { useImageUrl, useLoadImage } from "@/hooks/image";

/**
 * 封装 img
 * 用于显示本地路径的图片
 * @param props 和 img 标签具有相同的属性
 */
const LocalImage: React.FC<JSX.IntrinsicElements["img"]> = props => {
  const remoteUrl = useImageUrl(props.src);
  const [url] = useLoadImage(remoteUrl);
  const show =
    url &&
    props.src &&
    fse.existsSync(props.src) &&
    fse.statSync(props.src).isFile();
  return show ? <img {...props} src={url} alt={props.src} /> : null;
};

export default LocalImage;
