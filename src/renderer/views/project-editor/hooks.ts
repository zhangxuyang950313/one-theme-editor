import path from "path";

import fse from "fs-extra";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Notification } from "@arco-design/web-react";
import PathUtil from "src/common/utils/PathUtil";
import ProjectData from "src/data/ProjectData";
import ResourceConfig, { FileData } from "src/data/ResourceConfig";
import ScenarioConfig from "src/data/ScenarioConfig";
import { asyncQueue } from "src/common/utils";
import { FILE_EVENT } from "src/common/enums";
import { TypeFileData } from "src/types/file-data";
import { TypeProjectData } from "src/types/project";
import {
  TypeModuleConfig,
  TypePageConfig,
  TypeResourceConfig
} from "src/types/config.resource";
import { TypeScenarioConfig } from "src/types/config.scenario";
import FileDataCache from "src/common/classes/FileDataCache";
import LogUtil from "src/common/utils/LogUtil";
import { TypeFileChangeCallbackData } from "src/ipc/ipcInvoker";

import { useEditorDispatch } from "./store";
import {
  ActionSetProjectData,
  ActionSetResourceConfig,
  ActionSetScenarioConfig
} from "./store/action";

// 加载工程
export function useLoadProject(uuid: string): {
  projectData: TypeProjectData;
  resourceConfig: TypeResourceConfig;
  scenarioConfig: TypeScenarioConfig;
} {
  const dispatch = useEditorDispatch();

  const [projectData, setProjectData] = useState(ProjectData.default);
  const [resourceConfig, setResourceConfig] = useState(ResourceConfig.default);
  const [scenarioConfig, setScenarioConfig] = useState(ScenarioConfig.default);

  // 获取工程信息
  useLayoutEffect(() => {
    if (!uuid) return;
    window.$one.$server
      .findProjectQuery({ uuid })
      .then(setProjectData)
      .catch(err => {
        Notification.error({ title: "获取工程信息", content: err.message });
      });
  }, [uuid]);

  // 更新一下时间
  useLayoutEffect(() => {
    if (!projectData.uuid) return;
    window.$one.$server.updateProject({
      uuid: projectData.uuid,
      data: projectData
    });
  }, [projectData.uuid]);

  // 获取资源配置
  useLayoutEffect(() => {
    if (!projectData.resourceSrc) return;
    window.$one.$server
      .getResourceConfig(projectData.resourceSrc)
      .then(setResourceConfig)
      .catch(err => {
        Notification.error({ title: "获取资源配置", content: err.message });
      });
  }, [projectData.resourceSrc]);

  // 获取场景配置
  useLayoutEffect(() => {
    if (!projectData.scenarioSrc) return;
    window.$one.$server
      .getScenarioConfig(projectData.scenarioSrc)
      .then(setScenarioConfig)
      .catch(err => {
        Notification.error({ title: "获取场景配置", content: err.message });
      });
  }, [projectData.scenarioSrc]);

  // 设置进程间响应式数据
  useLayoutEffect(() => {
    if (!projectData.uuid) return;
    window.$one.$reactiveState.set("projectData", projectData);
    window.$one.$reactiveState.set("projectPath", projectData.root);
    return () => {
      window.$one.$reactiveState.set("projectData", ProjectData.default);
      window.$one.$reactiveState.set("projectPath", "");
    };
  }, [projectData.uuid]);

  // 设置进程间响应式数据
  useLayoutEffect(() => {
    if (!resourceConfig) return;
    const resourcePath = path.join(
      PathUtil.RESOURCE_CONFIG_DIR,
      resourceConfig.namespace
    );
    window.$one.$reactiveState.set("resourceConfig", resourceConfig);
    window.$one.$reactiveState.set("resourcePath", resourcePath);
    return () => {
      window.$one.$reactiveState.set("resourceConfig", ResourceConfig.default);
      window.$one.$reactiveState.set("resourcePath", "");
    };
  }, [resourceConfig]);

  useLayoutEffect(() => {
    if (!projectData.uuid) return;
    dispatch(ActionSetProjectData(projectData));
  }, [projectData.uuid]);

  useLayoutEffect(() => {
    if (!resourceConfig.src) return;
    dispatch(ActionSetResourceConfig(resourceConfig));
  }, [resourceConfig.src]);

  useLayoutEffect(() => {
    if (!scenarioConfig.name) return;
    dispatch(ActionSetScenarioConfig(scenarioConfig));
  }, [scenarioConfig.name]);

  return { projectData, resourceConfig, scenarioConfig };
}

const pageConfigMap = new Map<string, TypePageConfig>();

// 加载页面配置列表
export function usePageConfigList(
  namespace: string,
  moduleConfig: TypeModuleConfig
): TypePageConfig[] {
  const [pageConfigList, setPageConfigList] = useState<TypePageConfig[]>([]);
  // 依次加载当前模块页面配置
  useLayoutEffect(() => {
    if (!namespace) return;
    const queue = moduleConfig.pageList.map(page => async () => {
      // 使用缓存
      const configCache = pageConfigMap.get(page.src);
      if (configCache) {
        LogUtil.cache("pageConfig", page.src);
        return configCache;
      }
      // 服务获取
      const data = await window.$one.$server.getPageConfig({
        namespace,
        config: page.src
      });
      pageConfigMap.set(page.src, data);
      return data;
    });
    asyncQueue(queue)
      .then(setPageConfigList)
      .catch(err => Notification.error({ content: err.message }));
  }, [namespace, moduleConfig]);

  return pageConfigList;
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
    window.$one.$reactiveState.get("projectPath")
  );
  const list = useRef<Array<{ src: string; callback: TypeListener }>>([]);

  useLayoutEffect(() => {
    setRoot(window.$one.$reactiveState.get("projectPath"));
  }, []);
  useLayoutEffect(() => {
    // 移除监听器
    const removeListener = window.$one.$invoker.onFileChange(data => {
      if (data.root !== projectRoot) return;
      // 添加过滤器
      if (options?.filter && options.filter(data)) {
        return;
      }
      console.log(`file [${data.event}]:`, data);
      list.current.forEach(item => {
        if (item.src === data.src) {
          item.callback(data.event, data.src, data.data);
        }
      });
    });
    return removeListener;
  }, []);

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
  }, [src]);
}

export function useUpdateUrl(def: string): { url: string; update: () => void } {
  const [url, setUrl] = useState(def);
  const update = useCallback(() => {
    const _url = new URL(url);
    _url.searchParams.set("t", Date.now().toString());
    setUrl(_url.toString());
  }, [def]);
  return { url, update };
}
