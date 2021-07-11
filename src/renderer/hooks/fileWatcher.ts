import path from "path";
import fse from "fs-extra";
import logSymbols from "log-symbols";
import { WatchOptions, FSWatcher } from "chokidar";
import { useEffect, useState } from "react";
import { useProjectPathname } from "@/hooks/project";

export enum FILE_STATUS {
  ADD = "add",
  CHANGE = "change",
  UNLINK = "unlink"
}
const mapWatchers = (count: number, options?: WatchOptions) => {
  return new Array(count).fill(0).map(() => new FSWatcher(options));
};

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
      watcher.close();
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
 * @param pathname
 * @param listener
 */
export function useProjectFileWatcher(
  pathname: string,
  listener: (path: string, stats?: fse.Stats | undefined) => void
): void {
  const projectPathname = useProjectPathname();
  const watcher = useFSWatcherInstance();
  useEffect(() => {
    if (!projectPathname || !pathname) return;
    const file = path.join(projectPathname, pathname);
    watcher.unwatch(file);
    watcher
      .on(FILE_STATUS.ADD, listener)
      .on(FILE_STATUS.CHANGE, listener)
      .on(FILE_STATUS.UNLINK, listener)
      .add(file);
    return () => {
      watcher.unwatch(file);
    };
  }, [pathname]);
}

/**
 * 监听 releaseList，列表改变会自动销毁 watcher 并重建
 * @param releaseList
 * @returns
 */
export function useReleaseListWatcher(releaseList: string[]): string[] {
  const projectPathname = useProjectPathname();
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    if (!projectPathname) return;
    const watchers = mapWatchers(releaseList.length, {
      cwd: projectPathname || undefined,
      ignoreInitial: false
    });
    const set = new Set<string>();
    // 更新数据
    const updateList = () => {
      const existsList = Array.from(set).filter(
        item => item && fse.existsSync(path.join(projectPathname, item))
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
