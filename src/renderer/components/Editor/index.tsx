import React from "react";
import styled from "styled-components";
import { StyleBorderRight } from "@/style";
import PageSelector from "@/components/Editor/PageSelector";
import Previewer from "@/components/Editor/Previewer";
// import ResImageList from "@/components/Editor/ResImageList";
import ResHandlerList from "@/components/Editor/ResHandlerList";

// 主编辑区域
const EditorContainer: React.FC = () => {
  return (
    <StyleEditorContainer>
      {/* 页面选择器 */}
      <StylePageSelector>
        <PageSelector />
      </StylePageSelector>
      {/* 预览 */}
      <StylePreviewer>
        <Previewer />
      </StylePreviewer>
      {/* 素材编辑区 */}
      {/* <StyleResImageList>
        <ResImageList />
      </StyleResImageList> */}
      <StyleResXmlValList>
        <ResHandlerList />
      </StyleResXmlValList>
    </StyleEditorContainer>
  );
};

const StyleEditorContainer = styled.div`
  display: flex;
  overflow: auto;
  /* height: 100%; */
  flex-grow: 1;
  box-sizing: border-box;
`;

const StylePageSelector = styled(StyleBorderRight)`
  flex: 1;
  min-width: 200px;
  max-width: 280px;
  overflow: auto;
`;

const StylePreviewer = styled(StyleBorderRight)`
  flex: 1;
  flex-shrink: 0;
  padding: 20px;
  min-width: 300px;
  max-width: 350px;
  overflow: auto;
`;

// const StyleResImageList = styled(StyleBorderRight)`
//   flex-basis: 320px;
//   flex-shrink: 0;
//   padding: 20px;
//   overflow: auto;
// `;

const StyleResXmlValList = styled.div`
  /* min-width: 400px; */
  flex: 1;
  flex-shrink: 0;
  padding: 0 20px;
  overflow: auto;
`;

export default EditorContainer;
