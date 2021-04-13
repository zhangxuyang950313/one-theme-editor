import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";

import { useDocumentTitle } from "@/hooks";
import { useProject, useProjectById } from "@/hooks/project";
import { TypeTempModuleConf } from "@/types/project";

import { Button, Empty, Spin } from "antd";
import ModuleSelector from "@/components/Editor/ModuleSelector";
import EditorToolsBar from "@/components/Editor/ToolsBar";
import PageSelector from "@/components/Editor/PageSelector";
import ResourceContext from "@/components/Editor/ResourceContext";

const Editor: React.FC = () => {
  const [, updateTitle] = useDocumentTitle();
  const history = useHistory();
  // 从路由参数中获得项目 id
  const { pid } = useParams<{ pid: string }>();
  // 项目数据，null 表示未找到
  const projectData = useProjectById(pid);
  // 主题对象
  const project = useProject();
  // 选择的模块数据
  const [selectedModule, updateModule] = useState<TypeTempModuleConf>();

  // 默认选择第一个模块
  useEffect(() => {
    const firstModule = projectData?.templateConf.modules[0];
    if (firstModule) updateModule(firstModule);
  }, [projectData?.templateConf.modules]);

  // 安装主题信息
  useEffect(() => {
    if (!projectData) return;
    project.setup(projectData);
  }, [project, projectData]);

  // 还未安装
  if (!project.isInitialized) {
    return (
      <StyleEditorEmpty>
        <Spin tip="加载中" />
      </StyleEditorEmpty>
    );
  }

  // 空状态
  if (!projectData) {
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
  updateTitle(projectData?.projectInfo.name || "");
  console.log({ project: projectData });
  return (
    <StyleEditor>
      {/* 模块选择器 */}
      <ModuleSelector
        icons={projectData.previewData.previewConf.modules.map(item =>
          project.getBase64ByKey(item.icon)
        )}
        onSelected={index => {
          updateModule(projectData.previewData.previewConf.modules[index]);
        }}
      />
      <StyleEditorContext>
        <EditorToolsBar />
        <StyleEditorMain>
          <PageSelector tempClasses={selectedModule?.previewClass || []} />
          <ResourceContext />
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
  height: 100%;
  /* flex-grow: 1; */
`;

export default Editor;
