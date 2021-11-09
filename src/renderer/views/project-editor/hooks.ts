import path from "path";
import fse from "fs-extra";
import { useLayoutEffect, useState } from "react";
import { Notification } from "@arco-design/web-react";
import pathUtil from "src/common/utils/pathUtil";
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
    window.$server
      .findProjectQuery({ uuid })
      .then(setProjectData)
      .catch(err => {
        Notification.error({ title: "获取工程信息", content: err.message });
      });
  }, [uuid]);

  // 更新一下时间
  useLayoutEffect(() => {
    if (!projectData.uuid) return;
    window.$server.updateProject({ uuid: projectData.uuid, data: projectData });
  }, [projectData.uuid]);

  // 获取资源配置
  useLayoutEffect(() => {
    if (!projectData.resourceSrc) return;
    window.$server
      .getResourceConfig(projectData.resourceSrc)
      .then(setResourceConfig)
      .catch(err => {
        Notification.error({ title: "获取资源配置", content: err.message });
      });
  }, [projectData.resourceSrc]);

  // 获取场景配置
  useLayoutEffect(() => {
    if (!projectData.scenarioSrc) return;
    window.$server
      .getScenarioConfig(projectData.scenarioSrc)
      .then(setScenarioConfig)
      .catch(err => {
        Notification.error({ title: "获取场景配置", content: err.message });
      });
  }, [projectData.scenarioSrc]);

  // 设置进程间响应式数据
  useLayoutEffect(() => {
    if (!projectData.uuid) return;
    window.$reactiveState.set("projectData", projectData);
    window.$reactiveState.set("projectPath", projectData.root);
    return () => {
      window.$reactiveState.set("projectData", ProjectData.default);
      window.$reactiveState.set("projectPath", "");
    };
  }, [projectData.uuid]);

  // 设置进程间响应式数据
  useLayoutEffect(() => {
    if (!resourceConfig) return;
    const resourcePath = path.join(
      pathUtil.RESOURCE_CONFIG_DIR,
      resourceConfig.namespace
    );
    window.$reactiveState.set("resourceConfig", resourceConfig);
    window.$reactiveState.set("resourcePath", resourcePath);
    return () => {
      window.$reactiveState.set("resourceConfig", ResourceConfig.default);
      window.$reactiveState.set("resourcePath", "");
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
        console.log("use cache (pageConfig):", page.src);
        return configCache;
      }
      // 服务获取
      const data = await window.$server.getPageConfig({
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

const fileDataCache = new FileDataCache(window.$server.getFileDataSync);

type TypeListener = (
  evt: FILE_EVENT,
  src: string,
  fileData: TypeFileData
) => void;

// 监听文件
export function useSubscribeProjectFile(
  src: string | undefined,
  callback?: TypeListener
): void {
  const projectRoot = window.$reactiveState.get("projectPath");
  useLayoutEffect(() => {
    if (!src) return;
    const file = path.join(projectRoot, src);

    // 首次若文件存在则回调
    if (callback) {
      if (fse.existsSync(file)) {
        const fileData = fileDataCache.get(file);
        callback(FILE_EVENT.ADD, src, fileData);
      } else {
        callback(FILE_EVENT.UNLINK, src, FileData.default);
      }
    }

    const removeListener = window.$invoker.useFilesChange(data => {
      if (data.root !== projectRoot) return;
      if (data.src !== src) return;
      console.log(`file [${data.event}]:`, data);
      callback && callback(data.event, src, data.data);
    });

    return () => {
      removeListener();
    };
  }, [src]);
}