import { URLSearchParams } from "url";

import { useEffect, useState } from "react";
import { ipcRenderer, IpcRendererEvent } from "electron";
import { Canceler } from "axios";
import { LOAD_STATUS } from "src/common/enums";

import IPC_EVENT from "src/ipc/ipc-event";

import type { TypeProjectData } from "src/types/project";

export function useDocumentTitle(): [string, typeof setTitleMethod] {
  const setTitleMethod = (title: string) => {
    document.title = title;
  };
  return [document.title, setTitleMethod];
}

// 获取路由参数
export function useQuey<T extends Partial<{ [x: string]: string }>>(): T {
  const [query, setQuery] = useState<T>({} as T);
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setQuery(Object.fromEntries(search.entries()) as T);
  }, [window.location]);
  return query;
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

// 合并多个 status 状态
export function useMergeLoadStatus(statusList: LOAD_STATUS[]): LOAD_STATUS {
  let status = LOAD_STATUS.INITIAL;
  if (statusList.every(o => o === LOAD_STATUS.LOADING)) {
    // 都是加载状态为加载状态
    status = LOAD_STATUS.LOADING;
  } else if (statusList.every(o => o === LOAD_STATUS.SUCCESS)) {
    // 都是成功状态为成功状态
    status = LOAD_STATUS.SUCCESS;
  } else if (statusList.some(o => o === LOAD_STATUS.FAILED)) {
    // 有一个失败就是失败状态
    status = LOAD_STATUS.FAILED;
  } else if (statusList.some(o => o === LOAD_STATUS.TIMEOUT)) {
    // 有一个超时就是超时状态
    status = LOAD_STATUS.TIMEOUT;
  } else if (statusList.some(o => o === LOAD_STATUS.UNKNOWN)) {
    // 有一个未知就是未知状态
    status = LOAD_STATUS.UNKNOWN;
  }
  return status;
}

// 收听广播
export function useListenerBroadcast(): {
  onProjectCreated: (callback: (x: TypeProjectData) => void) => void;
} {
  // 监听器列表
  const listenerList: {
    event: IPC_EVENT;
    listener: ($event: IpcRendererEvent, $data: any) => void;
  }[] = [];
  const [listenerMap] = useState({
    // 工程创建完成
    onProjectCreated<T = TypeProjectData>(callback: (x: T) => void) {
      const listener = ($event: IpcRendererEvent, $data: T) => callback($data);
      ipcRenderer.on(IPC_EVENT.$projectCreated, listener);
      listenerList.push({ event: IPC_EVENT.$projectCreated, listener });
    }
  });
  // 清除监听器
  useEffect(() => {
    listenerList.forEach(item => {
      ipcRenderer.removeListener(item.event, item.listener);
    });
  }, []);
  return listenerMap;
}

// 创建带状态的异步函数
export function useCreatePromiseHook<T>(promise: () => Promise<T>, defaultVal: T): [T, LOAD_STATUS, () => Promise<T>] {
  const [state, setState] = useState<T>(defaultVal);
  const [status, setStatus] = useState<LOAD_STATUS>(LOAD_STATUS.INITIAL);
  const handleFetch: () => Promise<T> = async () => {
    setStatus(LOAD_STATUS.LOADING);
    // await sleep(300);
    return promise()
      .then(data => {
        setState(data);
        setStatus(LOAD_STATUS.SUCCESS);
        return data;
      })
      .catch(err => {
        setStatus(LOAD_STATUS.FAILED);
        throw err;
      });
  };
  return [state, status, handleFetch];
}
