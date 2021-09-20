import path from "path";
import fse from "fs-extra";
import logSymbols from "log-symbols";
import { WatchOptions, FSWatcher } from "chokidar";
import { useEffect, useState } from "react";
import { useProjectRoot } from "@/hooks/project/index";
import { FILE_STATUS } from "src/enum/index";

const mapWatchers = (count: number, options?: WatchOptions) => {
  return new Array(count).fill(0).map(() => new FSWatcher(options));
};

/**
 * 生成 fsWatcher 创建器
 * @returns
 */
export function useFSWatcherCreator(): (options?: WatchOptions) => FSWatcher {
  const [watcher, setWatcher] = useState<FSWatcher>();
  useEffect(() => {
    return () => {
      if (!watcher) return;
      const watcherList = watcher.getWatched();
      watcher.close().then(() => {
        console.log("111关闭文件监听", watcherList);
      });
    };
  }, []);
  return (options?: WatchOptions) => {
    if (watcher) return watcher;
    console.log("创建文件监听");
    const cWatcher = new FSWatcher(options);
    setWatcher(cWatcher);
    return cWatcher;
  };
}

/**
 * 返回一个 chokidar 监听实例，自动在组件卸载时释放监听
 * @param options WatchOptions
 * @returns
 */
export function useFSWatcherInstance(options?: WatchOptions): FSWatcher {
  const [watcher] = useState(new FSWatcher(options));
  useEffect(() => {
    watcher.setMaxListeners(9999);
    return () => {
      const watcherList = watcher.getWatched();
      watcher.close().then(() => {
        console.log("关闭文件监听", watcherList);
      });
    };
  }, []);
  return watcher;
}

/**
 * 一次组件生命周期中创建多个 watchers，不支持 count 改变重建
 *
 * TODO：在 electron 环境中 watcher 监听多个文件会导致事件丢失，（node环境正常，也可能是 webpack 的打包问题）
 * 原因不明，所以创建多个 watcher 实例只监听一个文件
 * https://github.com/paulmillr/chokidar/issues/1122
 * @param count 实例个数
 * @param options
 * @returns
 */
export function useFSWatcherMultiInstance(
  count: number,
  options?: WatchOptions
): FSWatcher[] {
  const [watchers, setWatchers] = useState<FSWatcher[]>([]);
  useEffect(() => {
    console.log(`创建watcher ${count} 个`);
    setWatchers(mapWatchers(count, options));
    return () => {
      Promise.all(watchers.map(item => item.close())).then(() => {
        console.log(`关闭watcher ${watchers.length} 个`);
      });
    };
  }, []);
  return watchers;
}

/**
 * 监听一个文件
 * @param paths
 * @param listener
 */
export function useProjectFileWatcher(
  paths: ReadonlyArray<string>,
  listener: (path: string, stats?: fse.Stats | undefined) => void
): void {
  const projectRoot = useProjectRoot();
  const watchers = useFSWatcherMultiInstance(paths.length, {
    cwd: projectRoot
  });
  useEffect(() => {
    if (!paths) return;
    watchers.forEach((watcher, index) => {
      watcher.unwatch(paths[index]);
      watcher
        .on(FILE_STATUS.ADD, listener)
        .on(FILE_STATUS.CHANGE, listener)
        .on(FILE_STATUS.UNLINK, listener)
        .add(paths[index]);
    });
    console.debug("开始监听", paths);
    return () => {
      watchers.forEach((watcher, index) => {
        watcher.unwatch(paths[index]);
      });
      console.debug("取消监听", paths);
    };
  }, [paths]);
}

/**
 * @deprecated
 * 监听 releaseList，列表改变会自动销毁 watcher 并重建
 * @param releaseList
 * @returns
 */
export function useReleaseListWatcher(releaseList: string[]): string[] {
  const projectRoot = useProjectRoot();
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    if (!projectRoot) return;
    const watchers = mapWatchers(releaseList.length, {
      cwd: projectRoot || undefined,
      ignoreInitial: false
    });
    const set = new Set<string>();
    // 更新数据
    const updateList = () => {
      const existsList = Array.from(set).filter(
        item => item && fse.existsSync(path.join(projectRoot, item))
      );
      setList(existsList);
    };
    setList([]);
    watchers.forEach((watcher, index) => {
      // 设定监听最大值
      // TODO：如果超过会是什么样
      watcher.setMaxListeners(10);
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
          set.add(relative);
          updateList();
        })
        // 删除/移动/重命名
        .on(FILE_STATUS.UNLINK, relative => {
          console.log(FILE_STATUS.UNLINK, relative);
          set.delete(relative);
          updateList();
        })
        .add(releaseList[index]);
    });
    console.log(logSymbols.info, `添加文件监听：`, releaseList);
    return () => {
      watchers.forEach((watcher, index) => {
        watcher.unwatch(releaseList[index]);
      });
      console.log(logSymbols.info, "移除文件监听：", releaseList);
      Promise.all(watchers.map(watcher => watcher.close()))
        .then(() => {
          console.log(
            logSymbols.info,
            `关闭watcher ${watchers.length} 个`,
            releaseList
          );
        })
        .catch(err => {
          console.log(logSymbols.warning, "关闭 watcher 失败", err);
        });
    };
  }, [releaseList]);

  return list;
}
