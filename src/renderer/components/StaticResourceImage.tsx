import React, { forwardRef } from "react";

import { LazyImage } from "./ImageCollection";

type TypeReactImageElement = JSX.IntrinsicElements["img"];
/**
 * 静态素材图片
 * @param props 和 img 标签具有相同的属性
 */
const StaticResourceImage = forwardRef<HTMLImageElement, TypeReactImageElement>(function StaticResourceImage(
  props,
  ref
) {
  return <LazyImage {...props} ref={ref} src={`resource://${props.src}`} alt="" />;
});

export default StaticResourceImage;
