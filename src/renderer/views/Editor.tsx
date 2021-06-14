import React from "react";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";

import { useDocumentTitle } from "@/hooks";
import { useLoadProject, useProjectById } from "@/hooks/project";

import { Button, Empty, Spin } from "antd";
import ModuleSelector from "@/components/Editor/ModuleSelector";
import EditorToolsBar from "@/components/Editor/ToolsBar";
import PageSelector from "@/components/Editor/PageSelector";
import Previewer from "@/components/Editor/Previewer";
import ResourceContext from "@/components/Editor/ResourceContext";
import { StyleBorderRight } from "@/style";

const Editor: React.FC = () => {
  const [, updateTitle] = useDocumentTitle();
  const history = useHistory();
  // 从路由参数中获得工程 id
  const { uuid } = useParams<{ uuid: string }>();
  // 工程数据，undefined
  const [projectData, isLoading] = useProjectById(uuid);

  // 加载工程
  useLoadProject(projectData);

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

  // 更新标题
  updateTitle(projectData.projectInfo.name || "");

  // 进入编辑状态
  return (
    <StyleEditor>
      {/* 模块选择器 */}
      <ModuleSelector />
      {/* 编辑区域 */}
      <StyleEditorContext>
        <EditorToolsBar />
        <StyleEditorMain>
          {/* 页面选择器 */}
          <StylePageSelector>
            <PageSelector />
          </StylePageSelector>
          {/* 预览 */}
          <StylePreviewer>
            <Previewer />
          </StylePreviewer>
          {/* 素材编辑区 */}
          <StyleResourceContent>
            <ResourceContext />
          </StyleResourceContent>
        </StyleEditorMain>
      </StyleEditorContext>
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

const StyleEditorContext = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyleEditorMain = styled.div`
  display: flex;
  overflow: hidden;
  height: 100%;
  flex-grow: 1;
  box-sizing: border-box;
`;

const StylePageSelector = styled(StyleBorderRight)`
  width: 260px;
  flex-shrink: 0;
  overflow: auto;
`;

const StylePreviewer = styled(StyleBorderRight)`
  width: 360px;
  padding: 20px;
  overflow: auto;
`;

const StyleResourceContent = styled(StyleBorderRight)`
  overflow: auto;
  box-sizing: border-box;
  /* flex-shrink: 0; */
`;

export default Editor;
