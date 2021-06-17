import React from "react";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";

import { useProjectData, useSetupProjectByUUID } from "@/hooks/project";

import { Button, Empty, Spin } from "antd";
import ModuleSelector from "@/components/Editor/ModuleSelector";
import EditorToolsBar from "@/components/Editor/ToolsBar";
import PageSelector from "@/components/Editor/PageSelector";
import Previewer from "@/components/Editor/Previewer";
import ResourceContent from "@/components/Editor/ResourceContent";
import { StyleBorderRight } from "@/style";

const Editor: React.FC = () => {
  const history = useHistory();
  // 从路由参数中获得工程 id
  const { uuid } = useParams<{ uuid: string }>();
  // 工程数据，undefined
  const [, isLoading] = useSetupProjectByUUID(uuid);

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
            <ResourceContent />
          </StyleResourceContent>
        </StyleEditorMain>
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
