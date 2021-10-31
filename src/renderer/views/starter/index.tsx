import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { StyleTopDrag } from "@/style";
import { PRESET_TITLE } from "src/enum";
import { TypeScenarioOption } from "src/types/scenario.config";
import { ScenarioOption } from "src/data/ScenarioConfig";
import { useDocumentTitle } from "@/hooks/index";
import RootWrapper from "@/RootWrapper";
import ProjectManager from "./components/ProjectManager";
import Sidebar from "./components/Sidebar";

// 开始页面
const Starter: React.FC = () => {
  const [, setTitle] = useDocumentTitle();
  const [scenarioOption, setScenarioOption] = useState(ScenarioOption.default);
  const [scenarioList, setScenarioList] = useState<TypeScenarioOption[]>([]);

  useEffect(() => {
    setTitle(PRESET_TITLE.welcome);
  }, []);

  useEffect(() => {
    window.$server.getScenarioOptionList().then(data => {
      console.log("获取 scenarioList", data);
      setScenarioList(data);
    });
  }, []);

  useEffect(() => {
    if (!scenarioList[0]) return;
    setScenarioOption(scenarioList[0]);
  }, [scenarioList]);

  return (
    <StyleStarter>
      <StyleTopDrag height="50px" />
      {/* 侧边栏 */}
      <Sidebar scenarioOptionList={scenarioList} onChange={setScenarioOption} />
      {/* 工程管理 */}
      <ProjectManager scenarioOption={scenarioOption} />
    </StyleStarter>
  );
};

const StyleStarter = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

RootWrapper(Starter);
