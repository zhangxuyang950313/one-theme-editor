import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { Button, Empty, Spin } from "antd";
import { StyleBorderRight } from "@/style";
import { useInitProject } from "@/hooks/project/index";
import { LOAD_STATUS } from "src/enum";
import ModuleSelector from "@/components/Editor/ModuleSelector";
import EditorToolsBar from "@/components/Editor/ToolsBar";
import EditorContainer from "@/components/Editor/index";

const Editor: React.FC = () => {
  const history = useHistory();
  const [projectData, status, handleFetch] = useInitProject();
  switch (status) {
    case LOAD_STATUS.INITIAL:
    case LOAD_STATUS.LOADING: {
      return (
        <StyleEditorEmpty>
          <Spin tip="加载中" />
        </StyleEditorEmpty>
      );
    }
    case LOAD_STATUS.FAILED:
    case LOAD_STATUS.UNKNOWN: {
      const isEmpty = projectData === null;
      return (
        <StyleEditorEmpty>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={isEmpty ? "暂无主题数据" : "加载失败"}
          />
          <Button
            type="primary"
            size="small"
            onClick={() => {
              handleFetch();
            }}
          >
            重试
          </Button>
          {isEmpty && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                history.replace("/");
              }}
            >
              返回首页
            </Button>
          )}
        </StyleEditorEmpty>
      );
    }
    default: {
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
    }
  }
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
