import path from "path";

import { remote } from "electron";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Empty, Message } from "@arco-design/web-react";
import { useToggle } from "ahooks";
import { TOOLS_BAR_BUTTON } from "src/common/enums";
import { ModuleConfig, PageConfig } from "src/data/ResourceConfig";

import {
  IconExport,
  IconEye,
  IconEyeInvisible,
  IconFile,
  IconInfoCircle,
  IconMindMapping,
  IconMobile
} from "@arco-design/web-react/icon";

import { usePageConfigList, useLoadProject } from "./hooks";
import EditorToolsBar from "./components/ToolsBar";
import ModuleSelector from "./components/ModuleSelector";
import PageSelector from "./components/PageSelector";
import Previewer from "./components/Previewer/index";
import ResourcePanel from "./components/ResourcePanel";
import StatusBar from "./components/StatusBar";

import { TypeIconButtonOption } from "@/components/one-ui/IconButton";
import { StyleTopDrag } from "@/style";
import RootWrapper from "@/RootWrapper";
import { useQuey } from "@/hooks";

// 编辑区域框架
const EditorFrame: React.FC = () => {
  const { uuid = "" } = useQuey<{ uuid?: string }>();
  const [, toggleProjectInfo] = useToggle(false);
  // 栏目开关
  const [displayModuleSelector, toggleModuleSelector] = useToggle(true);
  const [displayPageSelector, togglePageSelector] = useToggle(true);
  const [displayPreviewSelector, togglePreviewSelector] = useToggle(true);

  // 加载工程
  const { projectData, resourceConfig, scenarioConfig } = useLoadProject(uuid);
  const { namespace, moduleList } = resourceConfig;
  // 当前模块配置
  const [moduleConfig, setModuleConfig] = useState(ModuleConfig.default);
  // 当前页面配置
  const [pageConfig, setPageConfig] = useState(PageConfig.default);
  // 根据模块切换的页面配置列表
  const pageConfigList = usePageConfigList(namespace, moduleConfig);

  // 模块默认选第一个, 空则使用默认
  useEffect(() => {
    setModuleConfig(moduleList[0] || ModuleConfig.default);
  }, [moduleList]);

  // 页面默认选第一个, 空则使用默认
  useEffect(() => {
    setPageConfig(pageConfigList[0] || PageConfig.default);
  }, [pageConfigList]);

  // 工具栏按钮左侧
  const [leftButtons] = useState<TypeIconButtonOption[]>([
    {
      name: TOOLS_BAR_BUTTON.MODULE_TOGGLE,
      icon: <IconMindMapping />,
      defaultToggle: displayModuleSelector,
      onClick: toggleModuleSelector.toggle
    },
    {
      name: TOOLS_BAR_BUTTON.PAGE_TOGGLE,
      icon: <IconFile />,
      defaultToggle: displayPageSelector,
      onClick: togglePageSelector.toggle
    },
    {
      name: TOOLS_BAR_BUTTON.PREVIEW_TOGGLE,
      icon: displayPreviewSelector ? <IconEye /> : <IconEyeInvisible />,
      defaultToggle: displayPreviewSelector,
      onClick: togglePreviewSelector.toggle
    }
    // { name: TOOLS_BAR_BUTTON.PLACEHOLDER, icon: <div /> }
    // { name: TOOLS_BAR_BUTTON.DARK, icon: <InfoCircleOutlined /> },
    // { name: TOOLS_BAR_BUTTON.LIGHT, icon: <InfoCircleOutlined /> }
  ]);
  // 工具栏按钮右侧
  const [rightButtons, setRightButtons] = useState<TypeIconButtonOption[]>([]);

  useEffect(() => {
    setRightButtons([
      {
        name: TOOLS_BAR_BUTTON.APPLY,
        icon: <IconMobile />
      },
      // {
      //   name: TOOLS_BAR_BUTTON.SAVE,
      //   icon: <FolderOutlined />
      // },
      {
        name: TOOLS_BAR_BUTTON.EXPORT,
        icon: <IconExport />,
        onClick: () => {
          const { root, description } = projectData;
          const { extname } = scenarioConfig.packageConfig;
          const defaultPath = path.join(
            path.dirname(projectData.root),
            `${description.name}.${extname}`
          );
          remote.dialog
            // https://www.electronjs.org/docs/api/dialog#dialogshowopendialogsyncbrowserwindow-options
            .showSaveDialog({
              properties: ["createDirectory"],
              defaultPath,
              filters: [{ name: extname, extensions: [extname] }]
            })
            .then(result => {
              if (result.canceled) return;
              if (!result.filePath) {
                Message.info("未指定任何文件");
                return;
              }
              window.$one.$server.packProject(
                {
                  packDir: root,
                  outputFile: result.filePath,
                  packConfig: scenarioConfig.packageConfig
                },
                data => {
                  console.log(data);
                }
              );
            });
        }
      },
      {
        name: TOOLS_BAR_BUTTON.INFO,
        icon: <IconInfoCircle />,
        onClick: () => {
          toggleProjectInfo.setRight();
        }
      }
    ]);
  }, [projectData, scenarioConfig]);

  return (
    <StyleEditorFrame>
      <StyleTopBar height="30px">
        <span className="title">{document.title || "一个主题编辑器"}</span>
      </StyleTopBar>
      {/* 工具栏 */}
      <EditorToolsBar
        className="editor__tools-bar"
        buttonsGroupList={[leftButtons, rightButtons]}
      />
      {/* <ProjectInfoModal
        title="修改主题信息"
        centered
        destroyOnClose
        getContainer={thisRef.current || false}
        visible={projectInfoVisible}
        onCancel={() => setProjectInfoVisible(false)}
        onOk={() => setProjectInfoVisible(false)}
      /> */}
      <div className="editor__container">
        {/* 模块选择器 */}
        {displayModuleSelector && (
          <div className="editor__module-selector right-border-line">
            {moduleList.length ? (
              <ModuleSelector
                className="editor__module-content"
                moduleConfigList={moduleList}
                onChange={setModuleConfig}
              />
            ) : (
              <div className="no-config">无模块</div>
            )}
          </div>
        )}
        {/* 编辑区域 */}
        <div className="editor__content-wrapper">
          {/* 主编辑区域 */}
          <div className="editor__content">
            {/* 页面选择器 */}
            {displayPageSelector && (
              <div className="editor__page-selector right-border-line">
                {moduleConfig.pageList.length ? (
                  <PageSelector
                    className="editor__page-content"
                    pageConfigList={pageConfigList}
                    onChange={setPageConfig}
                  />
                ) : (
                  <div className="no-config">无页面</div>
                )}
              </div>
            )}
            {/* 预览 */}
            {/* TODO: 占位图 */}
            {displayPreviewSelector && (
              <div className="editor__previewer right-border-line">
                {pageConfig.config ? (
                  <>
                    <Previewer
                      className="previewer__content"
                      pageConfig={pageConfig}
                      mouseEffect
                    />
                    <div className="previewer__name">{pageConfig.name}</div>
                  </>
                ) : (
                  <div className="no-config">无预览</div>
                )}
              </div>
            )}
            {/* 资源编辑区 */}
            <div className="editor__resource-panel ">
              {pageConfig.config ? (
                <ResourcePanel
                  pageConfig={pageConfig}
                  iconEyeVisible={displayPreviewSelector}
                />
              ) : (
                <Empty className="no-config" description="无资源配置" />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 底部工具栏 */}
      <StatusBar className="editor__status-bar" />
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
  .no-config {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-4);
  }
  .editor__tools-bar {
    background-color: var(--color-bg-4);
    border-bottom: 1px solid var(--color-secondary);
  }
  .editor__container {
    height: 100%;
    display: flex;
    overflow-y: hidden;

    .editor__module-selector {
      flex-shrink: 0;
      width: 80px;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: var(--color-bg-5);
      .editor__module-content {
        width: 80px;
        margin: 0 auto;
        padding: 10px 0;
      }
    }
    .editor__content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-x: auto;
      .editor__content {
        display: flex;
        flex-grow: 1;
        overflow-y: auto;
        box-sizing: border-box;
        transition: 0.3s ease-out;
        .editor__page-selector {
          flex-shrink: 0;
          width: 120px;
          padding: 10px;
          overflow-y: auto;
          box-sizing: border-box;
          background-color: var(--color-bg-2);
          .editor__page-content {
            width: 100px;
          }
        }
        .editor__previewer {
          flex-shrink: 0;
          width: 340px;
          padding: 20px;
          box-sizing: border-box;
          overflow-y: auto;
          background-color: var(--color-bg-3);
          .previewer__content {
            width: 300px;
          }
          .previewer__name {
            margin: 10px;
            text-align: center;
            color: var(--color-text-1);
          }
        }
        .editor__resource-panel {
          flex: 1;
          flex-shrink: 0;
          overflow-y: auto;
          background-color: var(--color-bg-5);
        }
      }
    }
  }
  .editor__status-bar {
    flex-grow: 1;
    flex-shrink: 0;
    height: 30px;
    border-top: 1px solid var(--color-secondary-disabled);
    background-color: var(--color-bg-4);
  }
`;

RootWrapper(EditorFrame);
