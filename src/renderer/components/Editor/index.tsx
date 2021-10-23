import React from "react";
import styled from "styled-components";
import {
  usePageConfig,
  useModuleConfig,
  useResourceDefList
} from "@/hooks/resource";
import { StyleTopDrag } from "@/style";
import PageSelector from "@/components/Editor/PageSelector";
import Previewer from "@/components/Editor/Previewer";
import ResourcePanel from "@/components/Editor/ResourcePanel/index";
import ModuleSelector from "@/components/Editor/ModuleSelector";
import EditorToolsBar from "@/components/Editor/ToolsBar";
import StatusBar from "@/components/Editor/StatusBar";

// 编辑区域框架
const EditorFrame: React.FC = () => {
  const resourceList = useResourceDefList();
  const pageConfig = usePageConfig();
  const [{ pageList }] = useModuleConfig();
  return (
    <StyleEditorFrame>
      <StyleTopBar height="30px">
        <span className="title">{document.title || "一个主题编辑器"}</span>
      </StyleTopBar>
      {/* 工具栏 */}
      <div className="editor__tools-bar">
        <EditorToolsBar />
      </div>
      <div className="editor__container">
        {/* 模块选择器 */}
        <ModuleSelector className="editor__module-selector right-border-line" />
        {/* 编辑区域 */}
        <div className="editor__content-wrapper">
          {/* 主编辑区域 */}
          <div className="editor__content">
            {/* 页面选择器 */}
            <div className="editor__page-selector right-border-line">
              {pageList.length ? (
                <PageSelector pageList={pageList} />
              ) : (
                <div className="no-config">无配置</div>
              )}
            </div>
            {/* 预览 */}
            {/* TODO: 占位图 */}
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
      <div className="editor__status-bar">
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
      padding: 10px 0;
      overflow-y: auto;
      background-color: var(--bg-color-thirdly);
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
        .editor__page-selector {
          flex-shrink: 0;
          width: 120px;
          padding: 10px;
          overflow-y: auto;
          background-color: var(--bg-color-secondary);
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
    /* flex-shrink: 0; */
    height: 30px;
    border-top: 1px solid var(--border-color-thirdly);
    background-color: var(--bg-color-thirdly);
  }
`;

export default EditorFrame;
