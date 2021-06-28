import path from "path";
import fse from "fs-extra";
import chokidar from "chokidar";
import { Canceler } from "axios";
import logSymbols from "log-symbols";
import { useLayoutEffect, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputProps, message } from "antd";
import { apiGetPathConfig } from "@/api";
import { useProjectRoot } from "@/hooks/project";
import { useSourceConfigRoot } from "@/hooks/sourceConfig";
import { getPathConfig, getServerPort } from "@/store/modules/base/selector";
import { ActionSetPathConfig } from "@/store/modules/base/action";
import { TypePathConfig } from "types/index";

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

// 监听文件，初始化或删除返回空字符串
export enum FILE_STATUS {
  ADD = "add",
  CHANGE = "change",
  UNLINK = "unlink"
}
export function useWatchFile(file: string | string[]): {
  event: FILE_STATUS;
  file: string;
} {
  const [status, setStatus] = useState({
    event: FILE_STATUS.ADD,
    file: Array.isArray(file) ? file[0] : file
  });
  useEffect(() => {
    if (!file) return;
    console.log("watch", file);
    const watcher = chokidar
      .watch(file)
      .on(FILE_STATUS.ADD, filepath => {
        console.log(FILE_STATUS.ADD, filepath);
        setStatus({
          event: FILE_STATUS.ADD,
          file: filepath
        });
      })
      .on(FILE_STATUS.CHANGE, filepath => {
        console.log(FILE_STATUS.CHANGE, filepath);
        setStatus({
          event: FILE_STATUS.CHANGE,
          file: filepath
        });
      })
      .on(FILE_STATUS.UNLINK, filepath => {
        console.log(FILE_STATUS.UNLINK, filepath);
        setStatus({
          event: FILE_STATUS.UNLINK,
          file: filepath
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

// 返回一个 chokidar 监听实例，自动在组件卸载时释放监听
export function useFSWatcherInstance(
  options?: chokidar.WatchOptions
): chokidar.FSWatcher {
  const [watcher] = useState(new chokidar.FSWatcher(options));
  useEffect(() => {
    watcher.setMaxListeners(9999);
    return () => {
      watcher.close();
    };
  }, []);
  return watcher;
}

/**
 * 创建多个 watchers
 * @param count 实例个数
 * @param options
 * @returns
 */
export function useFSWatcherMultiInstance(
  count: number,
  options?: chokidar.WatchOptions
): chokidar.FSWatcher[] {
  const [watchers] = useState(
    new Array(count).fill(0).map(() => new chokidar.FSWatcher(options))
  );
  useEffect(() => {
    return () => {
      watchers.forEach(item => item.close());
    };
  }, []);
  return watchers;
}

/**
 * 监听模板列表文件
 * @param toList
 * @returns
 */
export function useToListWatcher(toList: string[]): string[] {
  const projectRoot = useProjectRoot();
  /**
   * TODO：在 electron 环境中 watcher 监听多个文件会导致事件丢失，（node环境正常，也可能是 webpack 的打包问题）
   * 原因不明，所以创建多个 watcher 实例只监听一个文件
   * https://github.com/paulmillr/chokidar/issues/1122
   */
  const watchers = useFSWatcherMultiInstance(toList.length, {
    cwd: projectRoot || undefined,
    ignoreInitial: false
  });
  const [list, setList] = useState<string[]>([]);
  useLayoutEffect(() => {
    if (!projectRoot) return;
    const set = new Set<string>();
    // 更新数据
    const updateList = () => {
      const existsList = Array.from(set).filter(
        item => item && fse.existsSync(path.join(projectRoot, item))
      );
      setList(existsList);
    };
    // updateList();
    watchers.forEach((watcher, index) => {
      // 设定监听最大值
      // TODO：如果超过会是什么样
      watcher.setMaxListeners(1);
      watcher
        // 增加/重命名
        .on(FILE_STATUS.ADD, relative => {
          console.log(FILE_STATUS.ADD, relative);
          set.add(relative);
          updateList();
        })
        // 变更
        .on(FILE_STATUS.CHANGE, relative => {
          console.log(FILE_STATUS.CHANGE, relative);
          set.delete(relative);
          setList([]);
          set.add(relative);
          updateList();
        })
        // 删除/移动/重命名
        .on(FILE_STATUS.UNLINK, relative => {
          console.log(FILE_STATUS.UNLINK, relative);
          set.delete(relative);
          updateList();
        })
        .add(toList[index]);
      console.log(logSymbols.info, `添加文件监听：${toList[index]}`);
    });
    return () => {
      watchers.forEach((watcher, index) => {
        watcher.unwatch(toList[index]);
        console.log(logSymbols.info, "移除文件监听：", toList[index]);
      });
    };
  }, []);

  return list;
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
