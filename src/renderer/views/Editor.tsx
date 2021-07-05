import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { Button, Empty, Spin } from "antd";
import { StyleBorderRight } from "@/style";
import { useLoadProject, useProjectData } from "@/hooks/project";
import ModuleSelector from "@/components/Editor/ModuleSelector";
import EditorToolsBar from "@/components/Editor/ToolsBar";
import PageSelector from "@/components/Editor/PageSelector";
import Previewer from "@/components/Editor/Previewer";
import ImageSourceList from "@/components/Editor/ImageSourceList";
import XmlSourceList from "@/components/Editor/XmlSourceList";

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
  overflow: hidden;
  height: 100%;
  flex-grow: 1;
  box-sizing: border-box;
`;

const StylePageSelector = styled(StyleBorderRight)`
  width: 250px;
  flex-shrink: 0;
  overflow: auto;
`;

const StylePreviewer = styled(StyleBorderRight)`
  width: 350px;
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
  /* width: 100%; */
  padding: 0 20px;
  flex-shrink: 0;
  overflow: auto;
`;

const Editor: React.FC = () => {
  const history = useHistory();
  const isLoading = useLoadProject();
  const projectData = useProjectData();

  // 还未安装
  if (isLoading) {
    return (
      <StyleEditorEmpty>
        <Spin tip="加载中" />
      </StyleEditorEmpty>
    );
  }

  // 空状态
  if (projectData === null) {
    return (
      <StyleEditorEmpty>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无主题数据"
        />
        <Button
          type="primary"
          size="small"
          onClick={() => history.replace("/")}
        >
          返回首页
        </Button>
      </StyleEditorEmpty>
    );
  }

  // 进入编辑状态
  return (
    <StyleEditor>
      {/* 模块选择器 */}
      <ModuleSelector />
      {/* 编辑区域 */}
      <StyleEditorContent>
        {/* 工具栏 */}
        <EditorToolsBar />
        {/* 主编辑区域 */}
        <EditorContainer />
      </StyleEditorContent>
    </StyleEditor>
  );
};

const StyleEditorEmpty = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyleEditor = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const StyleEditorContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default Editor;
