import React, { forwardRef, useImperativeHandle } from "react";
import { useLoadImageLazy, useLoadImage } from "@/hooks/image";

type TypeReactImageElement = JSX.IntrinsicElements["img"];

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
