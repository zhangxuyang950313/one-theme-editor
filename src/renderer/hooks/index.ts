import path from "path";
import { useLayoutEffect, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Canceler } from "axios";
import { InputProps, message } from "antd";

import { TypeImagePathLike, TypePathConfig } from "types/index";
import { getPathConfig, getServerPort } from "@/store/modules/base/selector";
import { getProjectLocalPath } from "@/store/modules/project/selector";
import { getCurrentSourceConfig } from "@/store/modules/source-config/selector";
import { apiGetPathConfig } from "@/api";
import { ActionSetPathConfig } from "@/store/modules/base/action";

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

// 生成绝对正确路径的图片 url
export function useImageUrl(): (x: TypeImagePathLike) => TypeImagePathLike {
  const host = useServerHost();
  return file => {
    return `${host}/image?file=${file}`;
  };
}

// 生成用于工程显示的图片 url
export function useProjectImageUrl(): (
  x: TypeImagePathLike
) => TypeImagePathLike {
  const host = useServerHost();
  const projectRoot = useSelector(getProjectLocalPath);
  return relative => {
    const file = path.join(projectRoot || "", relative || "");
    return `${host}/image?file=${file}`;
  };
}

// 生成用于配置图片显示的 url
export function useSourceImageUrl(): (
  x: TypeImagePathLike
) => TypeImagePathLike {
  const host = useServerHost();
  const pathConfig = usePathConfig();
  const currentSourceConfig = useSelector(getCurrentSourceConfig);
  return relative => {
    const file = path.join(
      pathConfig?.SOURCE_CONFIG_DIR || "",
      currentSourceConfig?.namespace || "",
      relative
    );
    return `${host}/image?file=${file}`;
  };
}
