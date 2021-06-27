import path from "path";
import { useSourceConfigRoot } from "@/hooks/sourceConfig";
import chokidar from "chokidar";
import { Canceler } from "axios";
import { useLayoutEffect, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputProps, message } from "antd";
import { apiGetPathConfig } from "@/api";
import { useProjectRoot } from "@/hooks/project";
import { getPathConfig, getServerPort } from "@/store/modules/base/selector";
import { ActionSetPathConfig } from "@/store/modules/base/action";
import { TypePathConfig } from "types/index";
import { useSourceConfig } from "./sourceConfig";

// 设置页面标题
export enum presetTitle {
  default = "一个主题编辑器"
}
export function useDocumentTitle(): [string, typeof setTitleMethod] {
  const setTitleMethod = (title: string) => {
    document.title = title;
  };
  return [document.title, setTitleMethod];
}

// 获取输入的值
type TypeUseInputValueReturn = {
  value: string;
  onChange: InputProps["onChange"];
};
export function useInputValue(initialVal: string): TypeUseInputValueReturn {
  const [value, updateVal] = useState(initialVal);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateVal(event.currentTarget.value);
  };
  return { value, onChange };
}

/**
 * axios 请求取消 hooks
 * @returns 返回一个注册函数用于 axios CancelToken
 */
export function useAxiosCanceler(): (c: Canceler) => void {
  const [canceler, updateCanceler] = useState<Canceler>();
  useEffect(() => () => canceler && canceler("组件销毁，取消请求"), []);
  return (c: Canceler) => updateCanceler(() => c);
}

/**
 * 用于在异步更新数据时组件提前销毁的情况
 * hooks 会在当前组件存活时进行数据更新，调用 updater
 * @returns 返回一个注册函数传入要更新数据的方法
 */
export function useAsyncUpdater(): (updater: () => void) => void {
  const [isDestroyed, updateDestroyed] = useState(false);
  useEffect(() => updateDestroyed(false), []); // 组件初始化
  useEffect(() => () => updateDestroyed(true), []); // 组件销毁

  return (updater: () => void) => {
    if (isDestroyed) return;
    updater();
  };
}

// 获取编辑器路径配置
export function usePathConfig(): TypePathConfig | null {
  return useSelector(getPathConfig);
}

// 生成当前服务域名
export function useServerHost(): string {
  const serverPort = useSelector(getServerPort);
  return `http://localhost:${serverPort}`;
}

// 初始化编辑器
export function useInitEditor(): boolean {
  const [loading, updateLoading] = useState(true);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    apiGetPathConfig()
      .then(async data => {
        dispatch(ActionSetPathConfig(data));
        console.log(data);
        await new Promise(resolve => setTimeout(resolve, 300));
        updateLoading(false);
      })
      .catch(err => {
        message.error({ content: err.message });
      });
  }, []);
  return loading;
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

// 生成用于工程显示的图片 url
export function useProjectImageUrl(): (x: string) => string {
  const prefix = useImagePrefix();
  const projectRoot = useProjectRoot();
  return relative => prefix + path.join(projectRoot || "", relative || "");
}

// 生成用于配置图片显示的 url
export function useSourceImageUrl(): (x: string) => string {
  const prefix = useImagePrefix();
  const sourceConfigRoot = useSourceConfigRoot();
  return relative => {
    if (!sourceConfigRoot || !relative) return "";
    return prefix + path.join(sourceConfigRoot, relative);
  };
}

// 监听文件，初始化或删除返回空字符串
export enum FILE_STATUS {
  ADD = "add",
  CHANGE = "change",
  UNLINK = "unlink"
}
export function useWatchFile(
  file: string | string[]
): { event: FILE_STATUS; file: string } {
  const [status, setStatus] = useState({
    event: FILE_STATUS.ADD,
    file: Array.isArray(file) ? file[0] : file
  });
  useEffect(() => {
    if (!file) return;
    console.log("watch", file);
    const watcher = chokidar
      .watch(file)
      .on(FILE_STATUS.ADD, p => {
        console.log("add", p);
        setStatus({
          event: FILE_STATUS.ADD,
          file: p
        });
      })
      .on("change", p => {
        console.log("change", p);
        setStatus({
          event: FILE_STATUS.CHANGE,
          file: p
        });
      })
      .on("unlink", p => {
        console.log("unlink", p);
        setStatus({
          event: FILE_STATUS.UNLINK,
          file: p
        });
      });
    return () => {
      console.log("unwatch", file);
      watcher.unwatch(file);
      watcher.close();
    };
  }, []);
  return status;
}

export function useWatchProjectFile(
  relative: string | string[]
): ReturnType<typeof useWatchFile> {
  const projectRoot = useProjectRoot();
  const files = Array.isArray(relative)
    ? relative.flatMap(item =>
        projectRoot ? [path.join(projectRoot, item)] : []
      )
    : [relative];
  const status = useWatchFile(files);
  return {
    event: status.event,
    file: projectRoot ? path.join(projectRoot, status.file) : ""
  };
}
