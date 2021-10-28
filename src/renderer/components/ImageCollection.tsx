import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  useLoadImageLazy,
  useLoadImageByPath,
  useLoadImage
} from "@/hooks/image";
import useSubscribeFile from "@/hooks/project/useSubscribeFile";
import { FILE_EVENT } from "src/enum";

type TypeReactImageElement = JSX.IntrinsicElements["img"];

/**
 * 封装 img
 * 用于显示本地路径的图片
 * @param props 和 img 标签具有相同的属性
 */
export const LocalImage = forwardRef<HTMLImageElement, TypeReactImageElement>(
  function LocalImage(props, ref) {
    const url = useLoadImageByPath(props.src || "");
    const show = url && props.src;
    return show ? <img ref={ref} {...props} src={url} alt={props.src} /> : null;
  }
);

/**
 * 封装 img 为预加载图片
 * 预加载的图片，利用浏览器缓存，实现不会从上到下慢慢加载，加载失败则不会有 img 节点
 * @param props 和 img 标签具有相同的属性
 */
export const PreloadImage = forwardRef<HTMLImageElement, TypeReactImageElement>(
  function PreloadImage(props, ref) {
    const url = useLoadImage(props.src || "");
    return <img ref={ref} {...props} src={url} alt="" />;
  }
);

/**
 * 封装 img 为懒加载图片
 * @param props
 * @returns
 */
export const LazyImage = forwardRef<HTMLImageElement, TypeReactImageElement>(
  function LazyImage(props, ref) {
    const imageRef = useLoadImageLazy(props.src || "");
    useImperativeHandle<HTMLImageElement | null, HTMLImageElement | null>(
      ref,
      () => imageRef.current
    );
    return <img {...props} src="" alt="" ref={imageRef} />;
  }
);

/**
 * 动态工程图片
 * @param props 和 img 标签具有相同的属性
 */
export const DynamicProjectImage = forwardRef<
  HTMLImageElement,
  TypeReactImageElement
>(function DynamicProjectImage(props, ref) {
  const [src, setSrc] = useState(props.src);
  useSubscribeFile(props.src, event => {
    if (event === FILE_EVENT.UNLINK) {
      setSrc("");
      return;
    }
    setSrc(`project://${props.src}?${Date.now()}`);
  });
  return <LazyImage {...props} ref={ref} src={src} alt="" />;
});

/**
 * 静态素材图片
 * @param props 和 img 标签具有相同的属性
 */
export const StaticResourceImage = forwardRef<
  HTMLImageElement,
  TypeReactImageElement
>(function StaticResourceImage(props, ref) {
  return (
    <LazyImage {...props} ref={ref} src={`resource://${props.src}`} alt="" />
  );
});

/**
 * 动态双向源图片
 */
export const DynamicBothSourceImage = forwardRef<
  HTMLImageElement,
  TypeReactImageElement
>(function DynamicBothSourceImage(props, ref) {
  const [src, setSrc] = useState(`src://${props.src}`);
  useSubscribeFile(props.src, event => {
    if (event === FILE_EVENT.UNLINK) {
      setSrc(`resource://${props.src}?t=${Date.now()}`);
      return;
    }
    setSrc(`src://${props.src}?=${Date.now()}`);
  });
  return <PreloadImage {...props} ref={ref} src={src} alt="" />;
});
