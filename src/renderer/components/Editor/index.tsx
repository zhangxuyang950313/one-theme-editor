import React from "react";
import styled from "styled-components";
import { StyleBorderRight } from "@/style";
import { usePatchPageSourceData } from "@/hooks/project";
import PageSelector from "@/components/Editor/PageSelector";
import Previewer from "@/components/Editor/Previewer";
import ImageSourceList from "@/components/Editor/ImageSourceList";
import XmlSourceList from "@/components/Editor/XmlSourceList";

// 主编辑区域
const EditorContainer: React.FC = () => {
  usePatchPageSourceData();
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
      <StyleImageSourceList>
        <ImageSourceList />
      </StyleImageSourceList>
      <StyleXmlSourceList>
        <XmlSourceList />
      </StyleXmlSourceList>
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
  max-width: 250px;
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

const StyleImageSourceList = styled(StyleBorderRight)`
  flex-basis: 320px;
  flex-shrink: 0;
  padding: 20px;
  overflow: auto;
`;

const StyleXmlSourceList = styled.div`
  flex-basis: 400px;
  flex-shrink: 0;
  padding: 0 20px;
  overflow: auto;
`;

export default EditorContainer;
