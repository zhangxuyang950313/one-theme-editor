import React from "react";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";

import { useDocumentTitle } from "@/hooks";
import { useProjectById } from "@/hooks/project";

import { Button, Empty } from "antd";
import ModuleSelector from "@/components/Editor/ModuleSelector";

const Editor: React.FC = () => {
  const [, updateTitle] = useDocumentTitle();
  // 从路由参数中获得项目 id
  const { pid } = useParams<{ pid: string }>();
  // 项目数据，null 表示未找到
  const project = useProjectById(pid);
  const history = useHistory();
  // 空状态
  if (!project)
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
  updateTitle(project?.projectInfo.name || "");
  console.log({ project });
  return (
    <StyleEditor>
      {/* 模块选择器 */}
      <ModuleSelector
        templateConfig={project.templateConfig}
        onSelected={tempModule => {
          //
        }}
      ></ModuleSelector>
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

const StyleEditor = styled.div``;

export default Editor;
