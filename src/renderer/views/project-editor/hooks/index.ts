import path from "path";

import { useLayoutEffect, useState } from "react";
import { Notification } from "@arco-design/web-react";
import PathUtil from "src/common/utils/PathUtil";
import ProjectData from "src/data/ProjectData";
import ResourceConfig from "src/data/ResourceConfig";
import ScenarioConfig from "src/data/ScenarioConfig";
import { asyncQueue } from "src/common/utils";

import { TypeModuleConfig, TypePageConfig, TypeResourceConfig } from "src/types/config.resource";

import LogUtil from "src/common/utils/LogUtil";

import { useEditorDispatch } from "../store/redux";
import { ActionSetProjectData, ActionSetResourceConfig, ActionSetScenarioConfig } from "../store/redux/action";

import type { TypeScenarioConfig } from "src/types/config.scenario";
import type { TypeProjectData } from "src/types/project";

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
  }, [projectData, projectData.uuid]);

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
    window.$one.$reactive.set("projectData", projectData);
    window.$one.$reactive.set("projectPath", projectData.root);
    return () => {
      window.$one.$reactive.set("projectData", ProjectData.default);
      window.$one.$reactive.set("projectPath", "");
    };
  }, [projectData, projectData.uuid]);

  // 设置进程间响应式数据
  useLayoutEffect(() => {
    if (!resourceConfig) return;
    const resourcePath = path.join(PathUtil.RESOURCE_CONFIG, resourceConfig.namespace);
    window.$one.$reactive.set("resourceConfig", resourceConfig);
    window.$one.$reactive.set("resourcePath", resourcePath);
    return () => {
      window.$one.$reactive.set("resourceConfig", ResourceConfig.default);
      window.$one.$reactive.set("resourcePath", "");
    };
  }, [resourceConfig]);

  useLayoutEffect(() => {
    if (!projectData.uuid) return;
    dispatch(ActionSetProjectData(projectData));
  }, [dispatch, projectData, projectData.uuid]);

  useLayoutEffect(() => {
    if (!resourceConfig.src) return;
    dispatch(ActionSetResourceConfig(resourceConfig));
  }, [dispatch, resourceConfig, resourceConfig.src]);

  useLayoutEffect(() => {
    if (!scenarioConfig.name) return;
    dispatch(ActionSetScenarioConfig(scenarioConfig));
  }, [dispatch, scenarioConfig, scenarioConfig.name]);

  return { projectData, resourceConfig, scenarioConfig };
}

const pageConfigMap = new Map<string, TypePageConfig>();

// 加载页面配置列表
export function usePageConfigList(namespace: string): {
  pageConfigList: TypePageConfig[];
  fetchPageConfigList: (params: TypeModuleConfig) => Promise<TypePageConfig[]>;
} {
  const [pageConfigList, setPageConfigList] = useState<TypePageConfig[]>([]);

  const fetchPageConfigList = async (moduleConfig: TypeModuleConfig) => {
    if (!namespace) return [];
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
    const list = await asyncQueue(queue).catch(err => {
      Notification.error({ content: err.message });
    });
    setPageConfigList(list || []);
    return list || [];
  };

  return {
    pageConfigList,
    fetchPageConfigList
  };
}
