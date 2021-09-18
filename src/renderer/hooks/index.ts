import { Canceler } from "axios";
import { useLayoutEffect, useEffect, useState } from "react";
import { InputProps, message } from "antd";
import { remote } from "electron";
import { apiSwopPathConfig } from "@/request/extra";
import {
  selectAppPath,
  selectServerPort
} from "@/store/global/modules/base/selector";
import { ActionSetAppConfig } from "@/store/global/modules/base/action";
import { useGlobalSelector, useGlobalDispatch } from "@/store/index";
import { TypePathConfig } from "src/types/extraConfig";
import { sleep } from "src/utils/index";
import { LOAD_STATUS } from "src/enum";

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
export function usePathConfig(): Partial<TypePathConfig> {
  return useGlobalSelector(selectAppPath);
}

// 生成当前服务域名
export function useServerHost(): string {
  const serverPort = useGlobalSelector(selectServerPort);
  return `http://localhost:${serverPort}`;
}

// 初始化编辑器配置数据
export function useInitEditorConfig(): [LOAD_STATUS, () => Promise<void>] {
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const dispatch = useGlobalDispatch();
  const fetch = async () => {
    setStatus(LOAD_STATUS.LOADING);
    try {
      const data = await apiSwopPathConfig({
        ELECTRON_LOCAL: remote.app.getLocale(),
        ELECTRON_HOME: remote.app.getPath("home"),
        ELECTRON_DESKTOP: remote.app.getPath("desktop"),
        ELECTRON_CACHE: remote.app.getPath("cache"),
        ELECTRON_APP_DATA: remote.app.getPath("appData"),
        ELECTRON_DOCUMENTS: remote.app.getPath("documents"),
        ELECTRON_DOWNLOADS: remote.app.getPath("downloads"),
        ELECTRON_EXE: remote.app.getPath("exe"),
        ELECTRON_LOGS: remote.app.getPath("logs"),
        ELECTRON_APP_PATH: remote.app.getAppPath()
      });
      dispatch(ActionSetAppConfig(data));
      await sleep(300);
      setStatus(LOAD_STATUS.SUCCESS);
    } catch (err) {
      message.error({ content: err });
      setStatus(LOAD_STATUS.FAILED);
    }
  };
  useLayoutEffect(() => {
    fetch();
  }, []);
  return [status, fetch];
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
