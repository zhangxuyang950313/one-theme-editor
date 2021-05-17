import React, { useLayoutEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";

import { useDocumentTitle } from "@/hooks";
import { useProjectById, useLoadProject } from "@/hooks/project";
import { TypeTempModuleConf, TypeTempPageConf } from "types/project";

import { Button, Empty, Spin } from "antd";
import { SplitPane } from "react-collapse-pane";
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
  const { pid } = useParams<{ pid: string }>();
  // 工程数据，undefined
  const [projectData, isLoading] = useProjectById(pid);
  // 选择的模块数据
  const [selectedModule, updateModule] = useState<TypeTempModuleConf>();
  // 选择的页面数据
  const [selectPage, updatePageData] = useState<TypeTempPageConf>();

  // 载入工程
  useLoadProject(projectData);

  // 默认选择第一个模块和第一个页面
  useLayoutEffect(() => {
    const firstModule = projectData?.template.modules[0];
    if (firstModule) updateModule(firstModule);
    const firstPage = firstModule?.groups[0].pages[0];
    if (firstPage) updatePageData(firstPage);
  }, [projectData?.template.modules]);

  // 预览所需配置
  // const previewConf = usePreviewConf();

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

  const icons = projectData.template.modules.map(item => ({
    icon: item.icon, // TODO 默认图标
    name: item.name
  }));

  const groups = selectedModule?.groups || [];

  // 进入编辑状态
  return (
    <StyleEditor>
      {/* 模块选择器 */}
      <ModuleSelector
        icons={icons}
        onSelected={index => {
          updateModule(projectData.template.modules[index]);
        }}
      />
      {/* 编辑区域 */}
      <StyleEditorContext>
        <EditorToolsBar />
        <StyleEditorMain>
          <SplitPane split="vertical">
            {/* 页面选择器 */}
            <StylePageSelector>
              <PageSelector pageGroups={groups} />
            </StylePageSelector>
            {/* 预览 */}
            <StylePreviewer>
              <Previewer pageConf={selectPage} />
            </StylePreviewer>
            {/* 素材编辑区 */}
            <StyleResourceContent>
              <ResourceContext pageConf={selectPage} />
            </StyleResourceContent>
          </SplitPane>
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
  /* display: flex; */
  /* overflow: auto; */
  /* flex: auto; */
  /* height: 100%; */
  /* flex-grow: 1;
  box-sizing: border-box; */
`;

const StylePageSelector = styled(StyleBorderRight)`
  /* width: 260px; */
  /* flex-shrink: 0; */
`;

const StylePreviewer = styled(StyleBorderRight)`
  /* width: 360px; */
  padding: 20px;
  /* flex-shrink: 0; */
`;

const StyleResourceContent = styled(StyleBorderRight)`
  /* width: 100%; */
  /* max-height: 100%; */
  overflow: auto;
  /* padding: 0 20px; */
  /* box-sizing: border-box; */
  /* flex-shrink: 0; */
`;

export default Editor;
