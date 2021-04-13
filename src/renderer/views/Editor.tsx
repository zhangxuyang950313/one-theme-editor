import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";

import { useDocumentTitle } from "@/hooks";
import { useProjectById } from "@/hooks/project";
import { TypeTempModuleConf } from "@/types/project";

import { Button, Empty } from "antd";
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
  const project = useProjectById(pid);

  const [selectedModule, updateModule] = useState<TypeTempModuleConf>();

  // 默认选择第一个模块
  useEffect(() => {
    const firstModule = project?.templateConf.modules[0];
    if (firstModule) updateModule(firstModule);
  }, [project?.templateConf.modules]);

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
        tempConf={project.templateConf}
        onSelected={tempModule => {
          //
          updateModule(tempModule);
          console.log(tempModule);
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
