import path from "path";
import { useEffect, useState } from "react";
import { Notification } from "@arco-design/web-react";
import pathUtil from "src/common/utils/pathUtil";
import ProjectData from "src/data/ProjectData";
import ResourceConfig from "src/data/ResourceConfig";
import ScenarioConfig from "src/data/ScenarioConfig";
import { TypeProjectData } from "src/types/project";
import {
  TypeModuleConfig,
  TypePageConfig,
  TypeResourceConfig
} from "src/types/resource.config";
import { TypeScenarioConfig } from "src/types/scenario.config";
import { asyncQueue } from "src/common/utils";
import {
  ActionPatchPageConfMap,
  ActionSetProjectData,
  ActionSetResourceConfig,
  ActionSetScenarioConfig
} from "./store/action";
import { useEditorDispatch, useEditorSelector } from "./store";

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
  useEffect(() => {
    if (!uuid) return;
    window.$server
      .findProjectQuery({ uuid })
      .then(setProjectData)
      .catch(err => {
        Notification.error({ title: "获取工程信息", content: err.message });
      });
  }, [uuid]);

  // 更新一下时间
  useEffect(() => {
    if (!projectData.uuid) return;
    window.$server.updateProject({ uuid: projectData.uuid, data: projectData });
  }, [projectData.uuid]);

  // 获取资源配置
  useEffect(() => {
    if (!projectData.resourceSrc) return;
    window.$server
      .getResourceConfig(projectData.resourceSrc)
      .then(setResourceConfig)
      .catch(err => {
        Notification.error({ title: "获取资源配置", content: err.message });
      });
  }, [projectData.resourceSrc]);

  // 获取场景配置
  useEffect(() => {
    if (!projectData.scenarioSrc) return;
    window.$server
      .getScenarioConfig(projectData.scenarioSrc)
      .then(setScenarioConfig)
      .catch(err => {
        Notification.error({ title: "获取场景配置", content: err.message });
      });
  }, [projectData.scenarioSrc]);

  // 设置进程间响应式数据
  useEffect(() => {
    if (!projectData.uuid) return;
    window.$reactiveState.set("projectData", projectData);
    window.$reactiveState.set("projectPath", projectData.root);
    return () => {
      window.$reactiveState.set("projectData", ProjectData.default);
      window.$reactiveState.set("projectPath", "");
    };
  }, [projectData.uuid]);

  // 设置进程间响应式数据
  useEffect(() => {
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

  useEffect(() => {
    if (!projectData.uuid) return;
    dispatch(ActionSetProjectData(projectData));
  }, [projectData.uuid]);

  useEffect(() => {
    if (!resourceConfig.src) return;
    dispatch(ActionSetResourceConfig(resourceConfig));
  }, [resourceConfig.src]);

  useEffect(() => {
    if (!scenarioConfig.name) return;
    dispatch(ActionSetScenarioConfig(scenarioConfig));
  }, [scenarioConfig.name]);

  return { projectData, resourceConfig, scenarioConfig };
}

// 加载页面配置列表
export function useLoadPageConfigList(
  namespace: string,
  moduleConfig: TypeModuleConfig
): TypePageConfig[] {
  const dispatch = useEditorDispatch();
  const [pageConfigList, setPageConfigList] = useState<TypePageConfig[]>([]);
  const pageConfigMap = useEditorSelector(state => state.pageConfigMap);
  // 依次加载当前模块页面配置
  useEffect(() => {
    if (!namespace) return;
    const pageConfDataQueue = moduleConfig.pageList.map(item => async () => {
      // 使用缓存
      const configCache = pageConfigMap[item.src];
      if (configCache) return configCache;

      const data = await window.$server.getPageConfig({
        namespace,
        config: item.src
      });
      dispatch(ActionPatchPageConfMap(data));
      return data;
    });
    asyncQueue(pageConfDataQueue)
      .then(setPageConfigList)
      .catch(err => Notification.error({ content: err.message }));
  }, [namespace, moduleConfig]);

  return pageConfigList;
}
