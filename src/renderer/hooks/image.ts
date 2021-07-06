import path from "path";
import { useState, useEffect, useRef } from "react";

import { useServerHost } from "@/hooks/index";
import { useProjectPathname } from "@/hooks/project";
import { useSourceConfigRoot } from "@/hooks/source";

// 返回图片前缀
export function useImagePrefix(): string {
  const host = useServerHost();
  return `${host}/image?filepath=`;
}

/**
 * 预加载图片，加载完成后刷新 url,防止切换闪烁或者从上到下加载不好的体验
 * @param src
 * @returns 加载成功返回 url 失败返回空字符串
 */
export function useLoadImage(src = ""): string {
  const [url, setFinalURL] = useState("");
  const [img] = useState(new Image());

  useEffect(() => {
    if (!src) return;
    img.onload = () => setFinalURL(src);
    img.onerror = () => setFinalURL("");
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
export function useLoadImageLazy(
  src?: string
): [string, React.RefObject<HTMLImageElement>] {
  const imageRef = useRef<HTMLImageElement>(null);
  const image = useState(new Image())[0];
  const [url, setUrl] = useState("");

  const doLoad = (imgUrl = "") => {
    image.onload = () => setUrl(imgUrl);
    image.onerror = () => setUrl("");
    image.src = imgUrl;
  };

  const onDestroy = () => {
    image.onload = () => Function.prototype;
    image.onerror = () => Function.prototype;
  };

  useEffect(() => {
    if (!imageRef.current) return;

    // 监听进入视窗
    const io = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio <= 0) return;
      doLoad(src);
      io.disconnect();
    });
    io.observe(imageRef.current);

    return onDestroy;
  }, [src, imageRef.current]);

  return [url, imageRef];
}

/**
 * 使用图片路径来预加载图片，基于 useLoadImage
 * @param filepath
 * @returns
 */
export function useLoadImageByPath(filepath = ""): string {
  const imageUrl = useImageUrl(filepath)[0];
  const url = useLoadImage(imageUrl);
  return url;
}

// /**
//  * 将本地路径预加载输出为图片服务路径用于展示
//  * @param filepathVal 本地路径
//  * @returns
//  */
// export function useImageUrlPreload(
//   filepathVal = ""
// ): [string, (x: string) => void] {
//   const prefix = useImagePrefix();
//   const [filepath, doRefreshUrl] = useState(filepathVal);
//   const [url, doReload] = useLoadImage(); // 预加载

//   useEffect(() => {
//     if (!filepath) return;
//     doReload(prefix + filepath);
//   }, [filepath]);

//   return [url, doRefreshUrl];
// }

/**
 * 将本地路径输出为图片服务路径用于展示
 * @param filepathVal
 * @returns
 */
export function useImageUrl(filepath: string): string {
  const prefix = useImagePrefix();
  return filepath ? prefix + filepath : "";
}

/**
 * 生成工程资源图片 url
 * @param relativePath
 */
export function useProjectImageUrl(relativePath?: string): string {
  const prefix = useImagePrefix();
  const projectPathname = useProjectPathname();

  return projectPathname && relativePath
    ? prefix + path.join(projectPathname, relativePath)
    : "";
}

/**
 * 生成配置资源图片 url
 * @param relativePath
 * @returns
 */
export function useSourceImageUrl(relativePath?: string): string {
  const prefix = useImagePrefix();
  const sourceConfigRoot = useSourceConfigRoot();

  return sourceConfigRoot && relativePath
    ? prefix + path.join(sourceConfigRoot, relativePath)
    : "";
}
