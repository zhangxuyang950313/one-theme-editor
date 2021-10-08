import React from "react";
import styled from "styled-components";
import { StyleBorderRight } from "@/style";
import PageSelector from "@/components/Editor/PageSelector";
import Previewer from "@/components/Editor/Previewer";
// import ResImageList from "@/components/Editor/ResImageList";
import ResourcePanel from "@/components/Editor/ResourcePanel";
import { useCurrentPageConfig } from "@/hooks/resource";

// 主编辑区域
const EditorContainer: React.FC = () => {
  const currentResPageConfig = useCurrentPageConfig();
  return (
    <StyleEditorContainer>
      {/* 页面选择器 */}
      <StylePageSelector>
        <div className="page-selector-container">
          <PageSelector />
        </div>
      </StylePageSelector>
      {/* 预览 */}
      <StylePreviewer>
        {/* TODO: 占位图 */}
        {currentResPageConfig && (
          <div className="preview-container">
            <Previewer pageConfig={currentResPageConfig} canClick useDash />
          </div>
        )}
      </StylePreviewer>
      {/* 资源编辑区 */}
      <StyleResourcePanel>
        <div className="resource-handler-container">
          <ResourcePanel />
        </div>
      </StyleResourcePanel>
    </StyleEditorContainer>
  );
};

const StyleEditorContainer = styled.div`
  display: flex;
  overflow-y: auto;
  /* height: 100%; */
  flex-grow: 1;
  box-sizing: border-box;
`;

const StylePageSelector = styled(StyleBorderRight)`
  /* flex: 1; */
  flex-shrink: 0;
  padding: 10px;
  overflow-y: auto;
  .page-selector-container {
    width: 120px;
  }
`;

const StylePreviewer = styled(StyleBorderRight)`
  flex-shrink: 0;
  padding: 20px;
  overflow-y: auto;
  .preview-container {
    flex: 1;
    min-width: 300px;
    max-width: 350px;
  }
`;

// const StyleResImageList = styled(StyleBorderRight)`
//   flex-basis: 320px;
//   flex-shrink: 0;
//   padding: 20px;
//   overflow: auto;
// `;

const StyleResourcePanel = styled.div`
  /* min-width: 400px; */
  flex: 1;
  flex-shrink: 0;
  overflow-y: auto;
  .resource-handler-container {
    flex: 1;
    width: 100%;
    height: 100%;
  }
`;

export default EditorContainer;
