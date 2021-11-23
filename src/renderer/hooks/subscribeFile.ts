import path from "path";

import fse from "fs-extra";
import { useLayoutEffect, useRef, useState, useCallback } from "react";
import FileDataCache from "src/common/classes/FileDataCache";
import { FILE_EVENT, PROTOCOL_TYPE } from "src/common/enums";
import { FileData } from "src/data/ResourceConfig";
import { TypeFileChangeCallbackData } from "src/ipc/ipcInvoker";
import { TypeFileData } from "src/types/file-data";

// 监听文件变化，返回动态的 url state fileData
export function useSubscribeFileData(
  src: string,
  options?: {
    // 双向输出
    isBothWay?: boolean;
    // 过滤器
    filter?: (
      event: FILE_EVENT,
      file: string,
      fileData: TypeFileData
    ) => boolean;
  }
): {
  url: string;
  state: FILE_EVENT;
  fileData: TypeFileData;
} {
  const protocol = options?.isBothWay
    ? PROTOCOL_TYPE.src
    : PROTOCOL_TYPE.project;
  const [url, setUrl] = useState(`${protocol}://${src}`);
  const [state, setState] = useState(FILE_EVENT.UNLINK);
  const [fileData, setFileData] = useState(FileData.default);
  const subscribe = useSubscribeSrc({ immediately: true });

  useLayoutEffect(() => {
    if (!src) return;
    subscribe(src, (event, file, fileData) => {
      if (options?.filter && options.filter(event, file, fileData)) {
        return;
      }
      setState(event);
      setFileData(fileData);
      const u = new URL(url);
      u.searchParams.set("t", Date.now().toString());
      setUrl(u.toString());
    });
  }, [src]);

  return { url, state, fileData };
}

const fileDataCache = new FileDataCache(window.$one.$server.getFileDataSync);

type TypeListener = (
  evt: FILE_EVENT,
  src: string,
  fileData: TypeFileData
) => void;

export function useSubscribeSrc(options?: {
  // 立即回调当前状态
  immediately?: boolean;
  // 过滤器
  filter?: (data: TypeFileChangeCallbackData) => boolean;
}): (src: string, callback: TypeListener) => void {
  const [projectRoot, setRoot] = useState(
    window.$one.$reactive.get("projectPath")
  );
  const list = useRef<Array<{ src: string; callback: TypeListener }>>([]);

  useLayoutEffect(() => {
    setRoot(window.$one.$reactive.get("projectPath"));
  }, []);
  useLayoutEffect(() => {
    // 移除监听器
    const removeListener = window.$one.$invoker.onFileChange(data => {
      if (data.root !== projectRoot) return;
      // 添加过滤器
      if (options?.filter && options.filter(data)) {
        return;
      }
      list.current.forEach(item => {
        if (item.src === data.src) {
          console.log(`file [${data.event}]:`, data);
          item.callback(data.event, data.src, data.data);
        }
      });
    });
    return removeListener;
  }, [options, projectRoot]);

  return (src: string, callback: TypeListener) => {
    list.current.push({ src, callback });
    const file = path.join(projectRoot, src);
    // 首次回调
    if (options?.immediately) {
      if (fse.existsSync(file)) {
        const fileData = fileDataCache.get(file);
        callback(FILE_EVENT.ADD, src, fileData);
      } else {
        callback(FILE_EVENT.UNLINK, src, FileData.default);
      }
    }
  };
}

// 监听单个 src 文件
export function useSubscribeSrcSingly(
  src: string | undefined,
  callback: TypeListener
): void {
  const subscribe = useSubscribeSrc({ immediately: true });
  useLayoutEffect(() => {
    if (!src) return;
    subscribe(src, callback);
  }, [callback, src, subscribe]);
}

export function useUpdateUrl(def: string): { url: string; update: () => void } {
  const [url, setUrl] = useState(def);
  const update = useCallback(() => {
    const _url = new URL(url);
    _url.searchParams.set("t", Date.now().toString());
    setUrl(_url.toString());
  }, [url]);
  return { url, update };
}
