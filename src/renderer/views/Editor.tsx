import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { Button, Empty, Spin } from "antd";
import { StyleBorderRight } from "@/style";
import {
  useLoadProject,
  useProjectData,
  useProjectPathname
} from "@/hooks/project";
import FileWatcher from "src/core/FileWatcher";
import ModuleSelector from "@/components/Editor/ModuleSelector";
import EditorToolsBar from "@/components/Editor/ToolsBar";
import PageSelector from "@/components/Editor/PageSelector";
import Previewer from "@/components/Editor/Previewer";
import ImageSourceList from "@/components/Editor/ImageSourceList";
import XmlSourceList from "@/components/Editor/XmlSourceList";

// 初始化目录监听器
const projectWatcher = new FileWatcher();
export const EditorContext = React.createContext({
  projectWatcher
});

// 主编辑区域
const EditorContainer: React.FC = () => {
  const projectRoot = useProjectPathname();

  // 添加工程目录监听
  useEffect(() => {
    if (!projectRoot) return;
    projectWatcher.watch(projectRoot, { cwd: projectRoot || undefined });
    return () => {
      projectWatcher.unwatch();
      projectWatcher.close();
    };
  }, [projectRoot]);

  return (
    <EditorContext.Provider value={{ projectWatcher }}>
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
    </EditorContext.Provider>
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
      <StyleModuleSelector>
        <ModuleSelector />
      </StyleModuleSelector>
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

const StyleModuleSelector = styled(StyleBorderRight)`
  width: 80px;
  height: 100vh;
  padding: 80px 0;
  flex-shrink: 0;
  overflow-y: auto;
`;

const StyleEditorContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: auto;
`;

export default Editor;
