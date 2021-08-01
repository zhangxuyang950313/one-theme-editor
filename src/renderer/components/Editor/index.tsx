import React from "react";
import styled from "styled-components";
import { StyleBorderRight } from "@/style";
import PageSelector from "@/components/Editor/PageSelector";
import Previewer from "@/components/Editor/Previewer";
import ImageSourceList from "@/components/Editor/ImageSourceList";
import XmlSourceList from "@/components/Editor/XmlSourceList";
import { usePatchPageSourceData } from "@/hooks/project";

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
  /* overflow: hidden; */
  height: 100%;
  flex-grow: 1;
  box-sizing: border-box;
`;

const StylePageSelector = styled(StyleBorderRight)`
  width: 230px;
  flex-shrink: 0;
  overflow: auto;
`;

const StylePreviewer = styled(StyleBorderRight)`
  width: 330px;
  padding: 20px;
  flex-shrink: 0;
  overflow: auto;
`;

const StyleImageSourceList = styled(StyleBorderRight)`
  width: 320px;
  padding: 20px;
  flex-shrink: 0;
  overflow: auto;
`;

const StyleXmlSourceList = styled.div`
  flex: 1;
  padding: 0 20px;
  flex-shrink: 0;
  overflow: auto;
`;

export default EditorContainer;
