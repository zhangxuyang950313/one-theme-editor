import path from "path";
import { useState, useEffect } from "react";

import { useProjectRoot } from "hooks/project";
import { useSourceConfigRoot } from "hooks/sourceConfig";
import { useServerHost } from "hooks/index";

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

// 返回图片前缀
export function useImagePrefix(): string {
  const host = useServerHost();
  return `${host}/image?file=`;
}

/**
 * 将本地路径输出为图片服务路径用于展示
 * @param filepath 本地路径
 * @returns
 */
export function useImageUrl(filepath?: string): string {
  const prefix = useImagePrefix();
  return filepath ? prefix + filepath : "";
}

/**
 * 将本地图片生成用于工程显示的图片 url
 * @param relativePath
 * ```
 * const getProjectImageUrl = useProjectImageUrl();
 * const url = getProjectImageUrl("/local/path/to/project/image");
 * ```
 * or
 * ```
 * const url = useProjectImageUrl("/local/path/to/project/image");
 * ```
 */
export function useProjectImageUrl(relativePath: string): string;
export function useProjectImageUrl(): (relativePath?: string) => string;
export function useProjectImageUrl(
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
 * 将本地图片生成用于配置显示的图片 url
 * @param relativePath
 * ```
 * const getSourceImageUrl = useSourceImageUrl();
 * const url = useSourceImageUrl("/local/path/to/sourceConfig/image");
 * ```
 * or
 * ```
 * const url = useSourceImageUrl("/local/path/to/sourceConfig/image");
 * ```
 */
export function useSourceImageUrl(relativePath: string): string;
export function useSourceImageUrl(): (relativePath?: string) => string;
export function useSourceImageUrl(
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
