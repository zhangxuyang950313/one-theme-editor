import path from "path";
import { useState, useEffect } from "react";

import { useServerHost } from "hooks/index";
import { useProjectRoot } from "hooks/project";
import { useSourceConfigRoot } from "hooks/sourceConfig";

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
export function useLoadImage(src = ""): [string, (x: string) => void] {
  const [preloadUrl, handleReload] = useState(src);
  const [url, setFinalURL] = useState(src);
  const [img] = useState(new Image());

  useEffect(() => {
    // 空值直接返回
    if (!preloadUrl) {
      setFinalURL("");
      return;
    }
    img.onload = () => setFinalURL(preloadUrl);
    img.onerror = () => setFinalURL("");
    img.src = preloadUrl;
    // 卸载数据响应
    return () => {
      img.onload = () => Function.prototype;
      img.onerror = () => Function.prototype;
    };
  }, [preloadUrl]);
  return [url, handleReload];
}

/**
 * 使用图片路径来预加载图片，基于 useLoadImage
 * @param filepath
 * @returns
 */
export function useLoadImageByPath(
  filepath = ""
): [string, (x: string) => void] {
  const [imageUrl, doRefreshUrl] = useImageUrl(filepath);
  const [url, handlePreload] = useLoadImage(imageUrl);
  useEffect(() => {
    handlePreload(imageUrl);
  }, [imageUrl]);
  return [url, doRefreshUrl];
}

/**
 * 将本地路径输出为图片服务路径用于展示
 * @param filepathVal 本地路径
 * @returns
 */
export function useImageUrl(filepathVal = ""): [string, (x: string) => void] {
  const prefix = useImagePrefix();
  const [filepath, doRefreshUrl] = useState(filepathVal);
  const [src, setSrc] = useLoadImage(); // 预加载
  useEffect(() => {
    setSrc(filepath ? prefix + filepath : "");
  }, [filepath]);
  return [src, doRefreshUrl];
}

/**
 * 返回一个由本地图片生成用于工程显示的图片 url
 * @param relativePath
 * ```
 * const getProjectImageUrl = useGetProjectImageUrl();
 * const url = getProjectImageUrl("/local/path/to/project/image");
 * ```
 * or
 * ```
 * const url = useGetProjectImageUrl("/local/path/to/project/image");
 * ```
 */
export function useGetProjectImageUrl(relativePath: string): string;
export function useGetProjectImageUrl(): (relativePath?: string) => string;
export function useGetProjectImageUrl(
  relativePath?: string | null
): string | ((relativePath?: string) => string) {
  const prefix = useImagePrefix();
  const projectRoot = useProjectRoot();

  if (relativePath) {
    return projectRoot ? prefix + path.join(projectRoot, relativePath) : "";
  }

  return relative => {
    if (!projectRoot || !relative) return "";
    return prefix + path.join(projectRoot, relative);
  };
}

/**
 * 返回一个由本地图片生成用于配置显示的图片 url
 * @param relativePath
 * ```
 * const getSourceImageUrl = useGetSourceImageUrl();
 * const url = useGetSourceImageUrl("/local/path/to/sourceConfig/image");
 * ```
 * or
 * ```
 * const url = useGetSourceImageUrl("/local/path/to/sourceConfig/image");
 * ```
 */
export function useGetSourceImageUrl(relativePath: string): string;
export function useGetSourceImageUrl(): (relativePath?: string) => string;
export function useGetSourceImageUrl(
  relativePath?: string | null
): string | ((relativePath?: string) => string) {
  const prefix = useImagePrefix();
  const sourceConfigRoot = useSourceConfigRoot();

  if (relativePath) {
    return sourceConfigRoot
      ? prefix + path.join(sourceConfigRoot, relativePath)
      : "";
  }

  return relative => {
    if (!sourceConfigRoot || !relative) return "";
    return prefix + path.join(sourceConfigRoot, relative);
  };
}

/**
 * 动态 SourceImageUrl，导出一个 state 数据和重新获取的方法
 * @param relativePath
 * @returns
 */
export function useSourceImageUrl(
  relativePath = ""
): [string, (x: string) => void] {
  const [relative, setRelative] = useState(relativePath);
  const [sourceUrl, setSourceUrl] = useState("");
  const getSourceImageUrl = useGetSourceImageUrl();

  useEffect(() => {
    setSourceUrl(getSourceImageUrl(relative));
  }, [relative]);
  return [sourceUrl, setRelative];
}