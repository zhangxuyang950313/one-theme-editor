import { useState, useEffect, useRef } from "react";

/**
 * 预加载图片，加载完成后刷新 url,防止切换闪烁或者从上到下加载不好的体验
 * @param src
 * @returns 加载成功返回 url 失败返回空字符串
 */
export function useLoadImage(src: string): string {
  const [url, setUrl] = useState("");
  const [img] = useState(new Image());

  useEffect(() => {
    img.onload = () => setUrl(src);
    img.onerror = () => setUrl("");
    img.src = src;

    // 卸载数据响应
    return () => {
      img.onload = () => Function.prototype;
      img.onerror = () => Function.prototype;
    };
  }, [src]);

  return url;
}

/**
 * 懒加载图片
 * @param src : ;
 * @returns url ImageRef
 */
export function useLoadImageLazy(src: string): React.RefObject<HTMLImageElement> {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const url = useLoadImage(imageUrl);

  useEffect(() => {
    if (!imageRef.current) return;

    // 监听进入视窗
    const io = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio <= 0) return;
      if (!imageRef.current) return;
      setImageUrl(src);
      io.disconnect();
    });
    io.observe(imageRef.current);

    return () => {
      io.disconnect();
    };
  }, [src, imageRef.current]);

  useEffect(() => {
    if (!imageRef.current) return;
    imageRef.current.src = url;
  }, [url]);

  return imageRef;
}
