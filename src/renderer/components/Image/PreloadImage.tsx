import React, { useEffect, useRef } from "react";
import { useLoadImage } from "@/hooks/image";

/**
 * 封装 img 为预加载图片
 * 用于预加载图片，不会从上到下慢慢加载，加载失败则不会有 img 节点
 * @param props 和 img 标签具有相同的属性
 */

const PreloadImage: React.FC<JSX.IntrinsicElements["img"]> = props => {
  const [url, doReload] = useLoadImage(props.src);
  const ImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!props.src) return;
    if (!ImageRef.current) return;
    const io = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio <= 0) return;
      if (!props.src) return;
      doReload(props.src);
      io.disconnect();
    });
    io.observe(ImageRef.current);
  }, [props.src, ImageRef.current]);

  if (!props.src) return null;
  return <img {...props} src={url} alt="" ref={ImageRef} />;
};

export default PreloadImage;
