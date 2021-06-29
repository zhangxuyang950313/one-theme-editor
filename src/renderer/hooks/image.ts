import { useState, useEffect } from "react";

/**
 * 预加载图片，防止闪烁
 * @param src
 * @returns 加载成功返回 url 失败返回空字符串
 */
export function useLoadImage(src = ""): [string, (x: string) => void] {
  const [preloadUrl, setPreloadURL] = useState(src);
  const [finalUrl, setFinalURL] = useState(src);
  const [img] = useState(new Image());

  useEffect(() => {
    img.onload = () => setFinalURL(preloadUrl);
    img.onerror = () => setFinalURL("");
    img.src = preloadUrl;

    return () => {
      img.onload = () => Function.prototype;
      img.onerror = () => Function.prototype;
    };
  }, [preloadUrl]);
  return [finalUrl, setPreloadURL];
}
