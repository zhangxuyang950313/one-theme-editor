import path from "path";
import { remote } from "electron";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { message, notification } from "antd";
import {
  ExportOutlined,
  InfoCircleOutlined,
  MobileOutlined,
  FolderOutlined,
  DeploymentUnitOutlined,
  TagsOutlined,
  TabletOutlined
} from "@ant-design/icons";
import {
  useCurrentPageConfig,
  useModuleConfig,
  useCurrentResourceDefList,
  useCurrentModuleList
} from "@/hooks/resource";
import { StyleTopDrag } from "@/style";
import { TOOLS_BAR_BUTTON } from "src/enum";
import { useToggle } from "ahooks";
import { useEditorSelector } from "@/store/editor";
import usePackProject from "@/hooks/project/usePackProject";
import { TypeIconButtonOption } from "@/components/IconButton";
import ResourcePanel from "./ResourcePanel";
import Previewer from "./Previewer";
import ModuleSelector from "./ModuleSelector";
import EditorToolsBar from "./ToolsBar";
import StatusBar from "./StatusBar";
import PageSelector from "./PageSelector";

// 编辑区域框架
const EditorFrame: React.FC = () => {
  const resourceList = useCurrentResourceDefList();
  const moduleList = useCurrentModuleList();
  const pageConfig = useCurrentPageConfig();
  const [currentModule, setCurrentModule] = useModuleConfig();
  const projectData = useEditorSelector(state => state.projectData);
  const packageConfig = useEditorSelector(
    state => state.scenarioConfig.packageConfig
  );
  // const packProject = usePackProject();
  const [projectInfoVisible, setProjectInfoVisible] = useState(false);

  const [moduleSelector, setModuleSelector] = useToggle(true);
  const [pageSelector, setPageSelector] = useToggle(true);
  const [previewSelector, setPreviewSelector] = useToggle(true);

  const [leftButtons, setLeftButtons] = useState<TypeIconButtonOption[]>([]);
  const [rightButtons, setRightButtons] = useState<TypeIconButtonOption[]>([]);

  // const removeCallback = window.$server.useFilesChange(data => {
  //   callbackList.current.forEach(item => {
  //     if (data.root === projectRoot && item.pathname === data.src) {
  //       item.callback(data.event);
  //       const fileData = getFileData(path.join(projectRoot, data.src));
  //       switch (fileData.fileType) {
  //         case "image/png":
  //         case "image/jpeg":
  //         case "application/xml": {
  //           fileDataMapRef.current[data.src] = fileData;
  //           dispatch(ActionPatchFileDataMap({ src: data.src, fileData }));
  //           break;
  //         }
  //       }
  //     }
  //   });
  // });
  // 生命周期结束取消监听
  // return () => {
  //   removeCallback();
  //   callbackList.current = [];
  // };

  useEffect(() => {
    setLeftButtons([
      {
        name: TOOLS_BAR_BUTTON.MODULE_TOGGLE,
        icon: <DeploymentUnitOutlined />,
        defaultToggle: moduleSelector,
        onClick: setModuleSelector.toggle
      },
      {
        name: TOOLS_BAR_BUTTON.PAGE_TOGGLE,
        icon: <TagsOutlined />,
        defaultToggle: pageSelector,
        onClick: setPageSelector.toggle
      },
      {
        name: TOOLS_BAR_BUTTON.PREVIEW_TOGGLE,
        icon: <TabletOutlined />,
        defaultToggle: previewSelector,
        onClick: setPreviewSelector.toggle
      }
      // { name: TOOLS_BAR_BUTTON.PLACEHOLDER, icon: <div /> }
      // { name: TOOLS_BAR_BUTTON.DARK, icon: <InfoCircleOutlined /> },
      // { name: TOOLS_BAR_BUTTON.LIGHT, icon: <InfoCircleOutlined /> }
    ]);
    setRightButtons([
      { name: TOOLS_BAR_BUTTON.APPLY, icon: <MobileOutlined /> },
      { name: TOOLS_BAR_BUTTON.SAVE, icon: <FolderOutlined /> },
      {
        name: TOOLS_BAR_BUTTON.EXPORT,
        icon: <ExportOutlined />,
        onClick: () => {
          const { root, description, scenarioSrc } = projectData;
          const { extname } = packageConfig;
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
                message.info("未指定任何文件");
                return;
              }
              // packProject(
              //   {
              //     scenarioSrc,
              //     packDir: root,
              //     outputFile: result.filePath
              //   },
              //   data => {
              //     notification.info({
              //       message: data.msg,
              //       description: data.data
              //     });
              //   }
              // );
            });
        }
      },
      {
        name: TOOLS_BAR_BUTTON.INFO,
        icon: <InfoCircleOutlined />,
        onClick: () => {
          setProjectInfoVisible(true);
        }
      }
    ]);
  }, []);
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
        {moduleSelector && (
          <div className="editor__module-selector right-border-line">
            <ModuleSelector
              className="editor__module-content"
              moduleList={moduleList}
              currentModule={currentModule}
              onChange={setCurrentModule}
            />
          </div>
        )}
        {/* 编辑区域 */}
        <div className="editor__content-wrapper">
          {/* 主编辑区域 */}
          <div className="editor__content">
            {/* 页面选择器 */}
            {pageSelector && (
              <div className="editor__page-selector right-border-line">
                {currentModule.pageList.length ? (
                  <PageSelector
                    className="editor__page-content"
                    pageList={currentModule.pageList}
                  />
                ) : (
                  <div className="no-config">无配置</div>
                )}
              </div>
            )}
            {/* 预览 */}
            {/* TODO: 占位图 */}
            {previewSelector && (
              <div className="editor__previewer right-border-line">
                {pageConfig ? (
                  <Previewer
                    className="previewer__content"
                    pageConfig={pageConfig}
                    canClick
                    useDash
                  />
                ) : (
                  <div className="no-config">未选择页面</div>
                )}
              </div>
            )}
            {/* 资源编辑区 */}
            <div className="resource-panel ">
              {pageConfig ? (
                <ResourcePanel
                  pageConfig={pageConfig}
                  resourceDefList={resourceList}
                />
              ) : (
                <div className="no-config">无资源数据</div>
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
  background-color: ${({ theme }) => theme["@background-color-thirdly"]};
  border-bottom: 1px solid ${({ theme }) => theme["@border-color-thirdly"]};
  .title {
    margin: auto;
    color: ${({ theme }) => theme["@text-color"]};
  }
`;

const StyleEditorFrame = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  --border-color-thirdly: ${({ theme }) => theme["@border-color-thirdly"]};
  --bg-color-thirdly: ${({ theme }) => theme["@background-color-thirdly"]};
  --bg-color-secondary: ${({ theme }) => theme["@background-color-secondary"]};
  .right-border-line {
    border-right: 1px solid var(--border-color-thirdly);
  }
  .no-config {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme["@disabled-color"]};
  }
  .editor__tools-bar {
    background-color: var(--bg-color-thirdly);
    border-bottom: 1px solid var(--border-color-thirdly);
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
      background-color: var(--bg-color-thirdly);
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
          background-color: var(--bg-color-secondary);
          .editor__page-content {
            width: 100px;
          }
        }
        .editor__previewer {
          flex-shrink: 0;
          padding: 20px;
          overflow-y: auto;
          width: 340px;
          .previewer__content {
            width: 300px;
            background-color: var(--bg-color-secondary);
          }
        }
        .resource-panel {
          flex: 1;
          flex-shrink: 0;
          overflow-y: auto;
          background-color: var(--bg-color-thirdly);
        }
      }
    }
  }
  .editor__status-bar {
    flex-grow: 1;
    flex-shrink: 0;
    height: 30px;
    border-top: 1px solid var(--border-color-thirdly);
    background-color: var(--bg-color-thirdly);
  }
`;

export default EditorFrame;
