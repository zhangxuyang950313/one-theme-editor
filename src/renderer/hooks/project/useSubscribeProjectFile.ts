import path from "path";
import { FSWatcher } from "chokidar";
import { useEffect, useRef } from "react";
import { FILE_EVENT } from "src/enum";
import { getFileData } from "src/common/utils/";
import { useEditorDispatch, useEditorSelector } from "@/store";
import { ActionPatchXmlFileDataMap } from "@/store/editor/action";
import { useProjectRoot } from "./index";

type TypeListener = (evt: FILE_EVENT) => void;
type TypeSubscribeFile = (
  pathname: string,
  options: { immediately: boolean },
  listener?: TypeListener
) => void;

let watcher: FSWatcher | null = null;
const subscribeMap = new Map<string, Set<TypeListener>>();

// // 订阅类
// class Subscribe {
//   private pathname: string;
//   private options?: { immediately: boolean };
//   private callback?: TypeListener;
//   constructor(pathname: string, options?: { immediately: boolean }) {
//     this.pathname = pathname;
//     this.options = options;
//   }
//   on(callback: TypeListener) {
//     this.callback = callback;
//     const { pathname } = this;
//     if (this.options?.immediately) {
//       const data = getFileData(path.join(projectRoot, pathname));
//       callback(FILE_EVENT.ADD, data);
//     }
//     // 存下当前生命周期内的 callback
//     callbackList.current.push({ pathname, callback });
//     // 将 callback 存入对应 file 的 callbackSet
//     const callbackSet = subscribeMap.get(pathname);
//     if (!callbackSet) {
//       subscribeMap.set(pathname, new Set([callback]));
//     } else {
//       callbackSet.add(callback);
//     }
//     return this;
//   }
//   remove() {
//     if (!this.callback) return;
//     const callbackSet = subscribeMap.get(this.pathname);
//     if (callbackSet?.has(this.callback)) {
//       callbackSet.delete(this.callback);
//     }
//   }
// }

// setInterval(() => {
//   console.log(subscribeMap);
// }, 1000);

// 监听当前页面文件
// 发布订阅模式，可多次订阅同一个 file
export default function useSubscribeProjectFile(): TypeSubscribeFile {
  const dispatch = useEditorDispatch();
  const projectRoot = useProjectRoot();
  const xmlFileDataMap = useEditorSelector(state => state.xmlFileDataMap);
  const callbackList = useRef(
    new Array<{ pathname: string; callback: TypeListener }>()
  );

  useEffect(() => {
    if (!path.isAbsolute(projectRoot)) return;
    if (projectRoot === watcher?.options.cwd) return;

    console.log("创建 watcher", projectRoot);
    watcher?.close();
    watcher = new FSWatcher({
      cwd: projectRoot,
      persistent: true, // 尽可能保持进程
      usePolling: true, // poll 模式
      ignoreInitial: true, // 初始化触发 add
      followSymlinks: false,
      atomic: false, // unlink 后超过 interval(atomic=true) 或 1 秒内重新被 add，则触发 change
      alwaysStat: true,
      ignorePermissionErrors: true,
      interval: 0
    }).setMaxListeners(9999);
    watcher.add("./**/*{.xml,.png,.9.png,.jpg,.jpeg,.webp}");

    const listener = (event: FILE_EVENT, src: string) => {
      console.log("文件变动", event, src);
      // 删除文件则清空这条数据
      if (event === FILE_EVENT.UNLINK) {
        dispatch(ActionPatchXmlFileDataMap({ src, fileData: null }));
      } else {
        const fileData = getFileData(path.join(projectRoot, src));
        if (fileData.fileType === "application/xml")
          dispatch(ActionPatchXmlFileDataMap({ src, fileData }));
      }
      // 通知订阅方
      const callbackList = subscribeMap.get(src);
      if (!(callbackList instanceof Set)) return;
      callbackList.forEach(callback => {
        callback(event);
      });
    };
    watcher.on(FILE_EVENT.ADD, file => listener(FILE_EVENT.ADD, file));
    watcher.on(FILE_EVENT.CHANGE, file => listener(FILE_EVENT.CHANGE, file));
    watcher.on(FILE_EVENT.UNLINK, file => listener(FILE_EVENT.UNLINK, file));

    // 生命周期结束取消监听
    return () => {
      // 清除本次生命周期的 callback
      callbackList.current.forEach(item => {
        subscribeMap.get(item.pathname)?.delete(item.callback);
      });
      watcher?.close().then(() => {
        console.log("销毁 watcher", projectRoot);
      });
      watcher = null;
    };
  }, [projectRoot]);

  // 订阅函数
  const subscribe: TypeSubscribeFile = (src, options, callback) => {
    if (options.immediately) {
      if (!xmlFileDataMap[src]) {
        const fileData = getFileData(path.join(projectRoot, src));
        if (fileData.fileType === "application/xml") {
          dispatch(ActionPatchXmlFileDataMap({ src, fileData }));
        }
      }
      if (callback) {
        callback(FILE_EVENT.ADD);
      }
    }

    if (callback) {
      // 存下当前生命周期内的 callback
      callbackList.current.push({ pathname: src, callback });
      // 将 callback 存入对应 file 的 callbackSet
      const callbackSet = subscribeMap.get(src);
      if (!callbackSet) {
        subscribeMap.set(src, new Set([callback]));
      } else {
        callbackSet.add(callback);
      }
    }
  };

  return subscribe;
}
