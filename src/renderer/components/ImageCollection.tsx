import React, { useState, useEffect } from "react";
import {
  useLoadImageLazy,
  useLoadImageByPath,
  useLoadImage
} from "@/hooks/image";
import useSubscribeProjectFile from "@/hooks/project/useSubscribeProjectFile";
import { FILE_EVENT } from "src/enum";

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
 * 动态工程图片
 * @param props 和 img 标签具有相同的属性
 */
export const DynamicProjectImage: TypeReactImageElement = props => {
  const subscribe = useSubscribeProjectFile();
  const [src, setSrc] = useState(props.src);
  useEffect(() => {
    if (!props.src) return;
    subscribe(props.src, { immediately: false }, event => {
      if (event === FILE_EVENT.UNLINK) {
        setSrc("");
        return;
      }
      setSrc(`project://${props.src}?${Date.now()}`);
    });
  }, [props.src]);
  return <LazyImage {...props} src={src} alt="" />;
};

/**
 * 静态素材图片
 * @param props 和 img 标签具有相同的属性
 */
export const StaticResourceImage: TypeReactImageElement = props => {
  return <LazyImage {...props} src={`resource://${props.src}`} alt="" />;
};

/**
 * 动态双向源图片
 */
export const DynamicBothSourceImage: TypeReactImageElement = props => {
  const subscribe = useSubscribeProjectFile();
  const [src, setSrc] = useState(`src://${props.src}`);
  useEffect(() => {
    if (!props.src) return;
    subscribe(props.src, { immediately: false }, event => {
      if (event === FILE_EVENT.UNLINK) {
        setSrc(`resource://${props.src}?t=${Date.now()}`);
        return;
      }
      setSrc(`src://${props.src}?t=${Date.now()}`);
    });
  }, [props.src]);
  return <PreloadImage {...props} src={src} alt="" />;
};
