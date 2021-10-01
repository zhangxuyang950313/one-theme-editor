import React from "react";
import styled from "styled-components";
import { PRESET_TITLE } from "src/enum";
import { useDocumentTitle } from "@/hooks/index";
import useFetchProjectList from "@/hooks/project/useFetchProjectList";
import useFetchScenarioOptionList from "@/hooks/resource/useFetchScenarioOptionList";
import useFetchResourceOptionList from "@/hooks/resource/useFetchResourceOptionList";

import Sidebar from "@/components/Starter/Sidebar";
import ProjectManager from "@/components/Starter/ProjectManager";

// 开始页面
const Starter: React.FC = () => {
  const [, setTitle] = useDocumentTitle();
  setTitle(PRESET_TITLE.welcome);

  useFetchScenarioOptionList();
  useFetchResourceOptionList();
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
