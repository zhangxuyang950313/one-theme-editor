import path from "path";

import React, { useLayoutEffect } from "react";
import styled from "styled-components";
import { Notification } from "@arco-design/web-react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import ScenarioConfig from "src/data/ScenarioConfig";
import ResourceConfig from "src/data/ResourceConfig";
import ProjectData from "src/data/ProjectData";
import PathUtil from "src/common/utils/PathUtil";

import EditorToolsBar from "./components/ToolsBar";
import ResourcePanel from "./components/ResourcePanel";
import StatusBar from "./components/StatusBar";

import { panelToggleState, projectDataState } from "./store/rescoil/state";

import usePageSelector from "./hooks/usePageSelector";
import useModuleSelector from "./hooks/useModuleSelector";

import usePrimaryPreviewer from "./hooks/usePrimaryPreviewer";

import { StyleTopDrag } from "@/style";
import { useQuey } from "@/hooks";
import RootWrapper from "@/RootWrapper";

// 编辑区域框架
const EditorFrame: React.FC = () => {
  const { uuid = "" } = useQuey<{ uuid?: string }>();

  const panelDisplayState = useRecoilValue(panelToggleState);
  const setProjectState = useSetRecoilState(projectDataState);
  const { projectData, resourceConfig } = useRecoilValue(projectDataState);

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
    const resourcePath = path.join(
      PathUtil.RESOURCE_CONFIG_DIR,
      resourceConfig.namespace
    );
    window.$one.$reactive.set("resourceConfig", resourceConfig);
    window.$one.$reactive.set("resourcePath", resourcePath);
    return () => {
      window.$one.$reactive.set("resourceConfig", ResourceConfig.default);
      window.$one.$reactive.set("resourcePath", "");
    };
  }, [resourceConfig]);

  // 获取工程信息
  useLayoutEffect(() => {
    if (!uuid) return;
    const fetchProject = async () => {
      const projectData = await window.$one.$server
        .findProjectQuery({ uuid })
        .catch(err => {
          Notification.error({
            title: "获取工程信息失败",
            content: err.message
          });
        });
      if (!projectData?.resourceSrc) return;

      const scenarioConfig = await window.$one.$server
        .getScenarioConfig(projectData.scenarioSrc)
        .catch(err => {
          Notification.error({
            title: "获取场景配置失败",
            content: err.message
          });
          return ScenarioConfig.default;
        });

      const resourceConfig = await window.$one.$server
        .getResourceConfig(projectData.resourceSrc)
        .catch(err => {
          Notification.error({
            title: "获取资源配置失败",
            content: err.message
          });
          return ResourceConfig.default;
        });

      setProjectState(() => ({
        projectData,
        resourceConfig,
        scenarioConfig
      }));
    };
    fetchProject();
  }, [setProjectState, uuid]);

  const { Content: ModuleSelector } = useModuleSelector();
  const { Content: PageSelector } = usePageSelector();
  const { Content: PrimaryPreviewer } = usePrimaryPreviewer();

  return (
    <StyleEditorFrame>
      <StyleTopBar height="30px">
        <span className="title">{document.title || "一个主题编辑器"}</span>
      </StyleTopBar>
      {/* 工具栏 */}
      <div className="editor--tools-bar">
        <EditorToolsBar />
      </div>
      {/* <ProjectInfoModal
        title="修改主题信息"
        centered
        destroyOnClose
        getContainer={thisRef.current || false}
        visible={projectInfoVisible}
        onCancel={() => setProjectInfoVisible(false)}
        onOk={() => setProjectInfoVisible(false)}
      /> */}
      <div className="editor--container">
        {/* 模块选择器 */}
        {panelDisplayState.moduleSelector && (
          <div className="editor--module-selector right-border-line">
            <div className="editor--module-content">{ModuleSelector}</div>
          </div>
        )}
        {/* 编辑区域 */}
        <div className="editor--content-wrapper">
          {/* 主编辑区域 */}
          <div className="editor--content">
            {/* 页面选择器 */}
            {panelDisplayState.pageSelector && (
              <div className="editor--page-selector right-border-line">
                <div className="editor--page-content">{PageSelector}</div>
              </div>
            )}
            {/* 预览 */}
            {/* TODO: 占位图 */}
            {panelDisplayState.pagePreview && (
              <div className="editor--previewer right-border-line">
                <div className="previewer--content">{PrimaryPreviewer}</div>
              </div>
            )}
            {/* 资源编辑区 */}
            <div className="editor--resource-panel ">
              <ResourcePanel />
            </div>
          </div>
        </div>
      </div>
      {/* 底部工具栏 */}
      <div className="editor--status-bar">
        <StatusBar />
      </div>
    </StyleEditorFrame>
  );
};

const StyleTopBar = styled(StyleTopDrag)`
  position: unset;
  flex-shrink: 0;
  padding: 0 100px;
  display: flex;
  background-color: var(--color-bg-4);
  border-bottom: 1px solid var(--color-secondary);
  .title {
    margin: auto;
    color: var(--color-text-1);
  }
`;

const StyleEditorFrame = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .right-border-line {
    border-right: 1px solid var(--color-secondary);
  }
  .editor--tools-bar {
    background-color: var(--color-bg-4);
    border-bottom: 1px solid var(--color-secondary);
  }
  .editor--container {
    height: 100%;
    display: flex;
    overflow-y: hidden;

    .editor--module-selector {
      flex-shrink: 0;
      width: 80px;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: var(--color-bg-5);
      .editor--module-content {
        width: 80px;
        margin: 0 auto;
        padding: 10px 0;
      }
    }
    .editor--content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-x: auto;
      .editor--content {
        display: flex;
        flex-grow: 1;
        overflow-y: auto;
        box-sizing: border-box;
        transition: 0.3s ease-out;
        .editor--page-selector {
          flex-shrink: 0;
          width: 120px;
          padding: 10px;
          overflow-y: auto;
          box-sizing: border-box;
          background-color: var(--color-bg-2);
          .editor--page-content {
            width: 100px;
            height: 100%;
          }
        }
        .editor--previewer {
          flex-shrink: 0;
          width: 340px;
          padding: 20px;
          box-sizing: border-box;
          overflow-y: auto;
          background-color: var(--color-bg-3);
          .previewer--content {
            width: 300px;
            height: 100%;
          }
        }
        .editor--resource-panel {
          flex: 1;
          flex-shrink: 0;
          overflow-y: auto;
          background-color: var(--color-bg-5);
        }
      }
    }
  }
  .editor--status-bar {
    flex-grow: 1;
    flex-shrink: 0;
    height: 30px;
    border-top: 1px solid var(--color-secondary-disabled);
    background-color: var(--color-bg-4);
  }
`;

RootWrapper(EditorFrame);
