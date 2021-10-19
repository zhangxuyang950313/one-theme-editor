import React from "react";
import styled from "styled-components";
import { useCurrentPageConfig } from "@/hooks/resource";
import { StyleTopDrag } from "@/style";
import PageSelector from "@/components/Editor/PageSelector";
import Previewer from "@/components/Editor/Previewer";
import ResourcePanel from "@/components/Editor/ResourcePanel/index";
import ModuleSelector from "@/components/Editor/ModuleSelector";
import EditorToolsBar from "@/components/Editor/ToolsBar";
import StatusBar from "@/components/Editor/StatusBar";

// 编辑区域框架
const EditorFrame: React.FC = () => {
  const pageConfig = useCurrentPageConfig();
  return (
    <StyleEditorFrame>
      <StyleTopBar height="30px">
        <span className="title">{document.title || "一个主题编辑器"}</span>
      </StyleTopBar>
      <div className="editor__container">
        {/* 模块选择器 */}
        <ModuleSelector className="editor__module-selector right-border-line" />
        {/* 编辑区域 */}
        <div className="editor__content-wrapper">
          {/* 工具栏 */}
          <div className="editor__tools-bar">
            <EditorToolsBar />
          </div>
          {/* 主编辑区域 */}
          <div className="editor__content">
            {/* 页面选择器 */}
            <PageSelector className="editor__page-selector right-border-line" />
            {/* 预览 */}
            {/* TODO: 占位图 */}
            <div className="editor__previewer right-border-line">
              {pageConfig && (
                <Previewer
                  className="previewer__content"
                  pageConfig={pageConfig}
                  canClick
                  useDash
                />
              )}
            </div>
            {/* 资源编辑区 */}
            <div className="resource-panel ">
              <ResourcePanel />
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
  border-bottom: 1px solid ${({ theme }) => theme["@border-color-secondary"]};
  padding: 0 100px;
  display: flex;
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
  .right-border-line {
    border-right: 1px solid;
    border-right-color: ${({ theme }) => theme["@border-color-secondary"]};
  }
  .editor__container {
    height: 100%;
    display: flex;
    overflow-y: hidden;

    .editor__module-selector {
      flex-shrink: 0;
      padding: 80px 0;
      overflow-y: auto;
      background-color: ${({ theme }) => theme["@background-color-secondary"]};
    }
    .editor__content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      /* width: 100%; */
      overflow-x: auto;
      .editor__tools-bar {
        background-color: ${({ theme }) =>
          theme["@background-color-secondary"]};
        border-bottom: 1px solid;
        border-bottom-color: ${({ theme }) => theme["@border-color-secondary"]};
      }
      .editor__content {
        display: flex;
        flex-grow: 1;
        overflow-y: auto;
        box-sizing: border-box;
        .editor__page-selector {
          flex-shrink: 0;
          padding: 10px;
          overflow-y: auto;
        }
        .editor__previewer {
          flex-shrink: 0;
          padding: 20px;
          overflow-y: auto;
          width: 380px;
          .previewer__content {
            width: 320px;
          }
        }
        .resource-panel {
          flex: 1;
          flex-shrink: 0;
          overflow-y: auto;
          background-color: ${({ theme }) =>
            theme["@background-color-thirdly"]};
        }
      }
    }
  }
  .editor__status-bar {
    flex-grow: 1;
    /* flex-shrink: 0; */
    height: 30px;
  }
`;

export default EditorFrame;
