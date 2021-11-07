import React, { useState, forwardRef } from "react";
import { FILE_EVENT } from "src/enum";
import { useSubscribeFile } from "../hooks";
import { LazyImage, PreloadImage } from "@/components/ImageCollection";

type TypeReactImageElement = JSX.IntrinsicElements["img"];
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
    const url = new URL(`project://${props.src}`);
    url.searchParams.set("t", Date.now().toString());
    setSrc(url.toString());
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
    // if (event === FILE_EVENT.UNLINK) {
    //   const url = new URL(`resource://${props.src}`);
    //   url.searchParams.set("t", Date.now().toString());
    //   setSrc(url.toString());
    //   return;
    // }
    // setSrc(`src://${props.src}?=${Date.now()}`);
    const url = new URL(`src://${props.src}`);
    url.searchParams.set("t", Date.now().toString());
    setSrc(url.toString());
  });
  return <PreloadImage {...props} ref={ref} src={src} alt="" />;
});
