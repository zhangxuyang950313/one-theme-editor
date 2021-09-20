import React from "react";
import styled from "styled-components";
import { useDocumentTitle } from "@/hooks/index";
import { useFetchProjectList } from "@/hooks/project";
import {
  useFetchScenarioOptionList,
  useFetchSourceOptionList
} from "@/hooks/source";
import { PRESET_TITLE } from "src/enum";

import Sidebar from "@/components/Starter/Sidebar";
import ProjectManager from "@/components/Starter/ProjectManager";

// 开始页面
const Starter: React.FC = () => {
  const [, setTitle] = useDocumentTitle();
  setTitle(PRESET_TITLE.default);

  useFetchScenarioOptionList();
  useFetchSourceOptionList();
  const projectList = useFetchProjectList();

  return (
    <StyleStarter>
      {/* 侧边栏 */}
      <Sidebar />
      {/* 工程管理 */}
      <ProjectManager
        status={projectList.status}
        onProjectCreated={projectList.fetch}
      />
    </StyleStarter>
  );
};

const StyleStarter = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export default Starter;
