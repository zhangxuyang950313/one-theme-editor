import path from "path";
import fse from "fs-extra";
import chokidar from "chokidar";
import logSymbols from "log-symbols";
import { useLayoutEffect, useEffect, useState } from "react";
import { useProjectPathname } from "@/hooks/project";

export enum FILE_STATUS {
  ADD = "add",
  CHANGE = "change",
  UNLINK = "unlink"
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
  const mapWatchers = () => {
    return new Array(count).fill(0).map(() => new chokidar.FSWatcher(options));
  };
  const [watchers, setWatchers] = useState<chokidar.FSWatcher[]>(mapWatchers());
  useEffect(() => {
    console.log("创建watcher");
    setWatchers(mapWatchers());
    return () => {
      console.log("关闭watcher");
      watchers.forEach(item => item.close());
    };
  }, []);
  return watchers;
}

/**
 * 监听模板列表文件
 * @param releaseList
 * @returns
 */
export function useReleaseListWatcher(releaseList: string[]): string[] {
  const projectPathname = useProjectPathname();
  /**
   * TODO：在 electron 环境中 watcher 监听多个文件会导致事件丢失，（node环境正常，也可能是 webpack 的打包问题）
   * 原因不明，所以创建多个 watcher 实例只监听一个文件
   * https://github.com/paulmillr/chokidar/issues/1122
   */
  const watchers = useFSWatcherMultiInstance(releaseList.length, {
    cwd: projectPathname || undefined,
    ignoreInitial: false
  });
  const [list, setList] = useState<string[]>([]);
  useLayoutEffect(() => {
    if (!projectPathname) return;
    const set = new Set<string>();
    // 更新数据
    const updateList = () => {
      const existsList = Array.from(set).filter(
        item => item && fse.existsSync(path.join(projectPathname, item))
      );
      setList(existsList);
    };
    // updateList();
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
      console.log(logSymbols.info, `添加文件监听：${releaseList[index]}`);
    });
    return () => {
      watchers.forEach((watcher, index) => {
        watcher.unwatch(releaseList[index]);
        console.log(logSymbols.info, "移除文件监听：", releaseList[index]);
      });
    };
  }, []);

  return list;
}
