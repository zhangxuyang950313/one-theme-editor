import React, { useState } from "react";
import styled from "styled-components";
import { ScenarioOption } from "src/data/ScenarioConfig";
import ProjectListDisplay from "./components/ProjectListDisplay";
import Sidebar from "./components/Sidebar";
import RootWrapper from "@/RootWrapper";
import { StyleTopDrag } from "@/style";

// 开始页面
const ProjectManager: React.FC = () => {
  // 选中的场景
  const [scenarioOption, setScenarioOption] = useState(ScenarioOption.default);

  return (
    <StyleProjectManager>
      <StyleTopDrag height="50px" />
      {/* 侧边栏 */}
      <Sidebar onScenarioChange={setScenarioOption} />
      {/* 工程管理 */}
      <ProjectListDisplay scenarioOption={scenarioOption} />
    </StyleProjectManager>
  );
};

const StyleProjectManager = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

RootWrapper(ProjectManager);
