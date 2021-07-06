import React from "react";
import { useLoadImageLazy } from "@/hooks/image";

/**
 * 封装 img 为预加载图片
 * 用于预加载图片，不会从上到下慢慢加载，加载失败则不会有 img 节点
 * @param props 和 img 标签具有相同的属性
 */

const PreloadImage: React.FC<JSX.IntrinsicElements["img"]> = props => {
  const [url, imageRef] = useLoadImageLazy(props.src);
  return <img {...props} src={url} alt="" ref={imageRef} />;
};

export default PreloadImage;
