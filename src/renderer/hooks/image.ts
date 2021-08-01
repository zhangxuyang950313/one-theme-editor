import path from "path";
import { useState, useEffect, useRef } from "react";

import { useServerHost } from "@/hooks/index";
import { useProjectRoot } from "@/hooks/project";
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
export function useLoadImageLazy(
  src: string
): React.RefObject<HTMLImageElement> {
  const imageRef = useRef<HTMLImageElement>(null);
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

/**
 * 使用图片路径来预加载图片，基于 useLoadImage
 * @param filepath
 * @returns
 */
export function useLoadImageByPath(filepath: string): string {
  const imageUrl = useImageUrl(filepath)[0];
  return useLoadImage(imageUrl);
}

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
  const projectRoot = useProjectRoot();

  return projectRoot && relativePath
    ? prefix + path.join(projectRoot, relativePath)
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

/**
 * 图片参数改变实现强制重载
 * @param imageUrl
 * @returns
 */
export function useForceUpdateImageUrl(imageUrl: string): [string, () => void] {
  const [url, updateUrl] = useState(imageUrl);
  const [count, updateCount] = useState(0);

  const forceUpdate = () => {
    updateUrl(imageUrl ? `${imageUrl}&count=${count}` : "");
    updateCount(count + 1);
  };

  useEffect(() => {
    forceUpdate();
  }, [imageUrl]);

  return [url, forceUpdate];
}
