import React, { useLayoutEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";

import { useDocumentTitle } from "@/hooks";
import {
  usePreviewConf,
  useProjectById,
  useLoadProject
} from "@/hooks/project";
import { TypeTempModuleConf } from "types/project";

import { Button, Empty, Spin } from "antd";
import ModuleSelector from "@/components/Editor/ModuleSelector";
import EditorToolsBar from "@/components/Editor/ToolsBar";
import PageSelector from "@/components/Editor/PageSelector";
import ResourceContext from "@/components/Editor/ResourceContext";

const Editor: React.FC = () => {
  const [, updateTitle] = useDocumentTitle();
  const history = useHistory();
  // 从路由参数中获得工程 id
  const { pid } = useParams<{ pid: string }>();
  // 工程数据，undefined
  const [projectData, isLoading] = useProjectById(pid);
  // 选择的模块数据
  const [selectedModule, updateModule] = useState<TypeTempModuleConf>();

  // 载入工程
  useLoadProject(projectData);

  // 默认选择第一个模块
  useLayoutEffect(() => {
    const firstModule = projectData?.previewConf.modules[0];
    if (firstModule) updateModule(firstModule);
  }, [projectData?.previewConf.modules]);

  // 预览所需配置
  const previewConf = usePreviewConf();

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
      <ModuleSelector
        icons={
          previewConf?.modules.map(item => ({
            icon: "", // TODO 默认图标
            name: item.name
          })) || []
        }
        onSelected={index => {
          if (previewConf) {
            updateModule(previewConf.modules[index]);
          }
        }}
      />
      {/* 编辑区域 */}
      <StyleEditorContext>
        <EditorToolsBar />
        <StyleEditorMain>
          <PageSelector previewClass={selectedModule?.classes || []} />
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
