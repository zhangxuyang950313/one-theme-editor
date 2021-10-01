import React from "react";
import {
  useLoadImageLazy,
  useLoadImageByPath,
  useLoadImage
} from "@/hooks/image";
import { useResourceImageUrl } from "@/hooks/resource/index";
import { useProjectImageUrl } from "@/hooks/project/index";

type TypeReactImageElement = React.FC<JSX.IntrinsicElements["img"]>;

/**
 * 封装 img
 * 用于显示本地路径的图片
 * @param props 和 img 标签具有相同的属性
 */
export const LocalImage: TypeReactImageElement = props => {
  const url = useLoadImageByPath(props.src || "");
  const show = url && props.src;
  return show ? <img {...props} src={url} alt={props.src} /> : null;
};

/**
 * 封装 img 为预加载图片
 * 预加载的图片，利用浏览器缓存，实现不会从上到下慢慢加载，加载失败则不会有 img 节点
 * @param props 和 img 标签具有相同的属性
 */
export const PreloadImage: TypeReactImageElement = props => {
  const url = useLoadImage(props.src || "");
  return <img {...props} src={url} alt="" />;
};

/**
 * 封装 img 为懒加载图片
 * @param props
 * @returns
 */
export const LazyImage: TypeReactImageElement = props => {
  const imageRef = useLoadImageLazy(props.src || "");
  return <img {...props} src="" alt="" ref={imageRef} />;
};

/**
 * 用于显示工程图片
 * @param props 和 img 标签具有相同的属性
 */
export const ProjectImage: TypeReactImageElement = props => {
  const imageUrl = useProjectImageUrl(props.src);
  return <LazyImage {...props} src={imageUrl} alt="" />;
};

/**
 * 用于显示素材图片
 * @param props 和 img 标签具有相同的属性
 */
export const SourceImage: TypeReactImageElement = props => {
  const imageUrl = useResourceImageUrl(props.src || "");
  return <LazyImage {...props} src={imageUrl} alt="" />;
};
