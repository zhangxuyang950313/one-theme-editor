import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TypeScenarioOption } from "src/types/config.scenario";
import { Notification } from "@arco-design/web-react";

import { useProjectManagerDispatch } from "./store";
import { ActionSetScenario } from "./store/action";
import Sidebar from "./components/Sidebar";
import ProjectDisplayTable from "./components/ProjectDisplayTable";

import RootWrapper from "@/RootWrapper";
import { StyleTopDrag } from "@/style";

// 开始页面
const ProjectManager: React.FC = () => {
  const dispatch = useProjectManagerDispatch();
  // 场景列表
  const [scenarioList, setScenarioList] = useState<TypeScenarioOption[]>([]);

  // 获取场景配置列表
  useEffect(() => {
    window.$one.$server
      .getScenarioOptionList()
      .then(setScenarioList)
      .catch(err => {
        Notification.error({ content: err.message });
      });
  }, []);

  return (
    <StyleProjectManager>
      <StyleTopDrag height="50px" />
      {/* 侧边栏 */}
      <Sidebar
        scenarioList={scenarioList}
        onScenarioChange={scenario => {
          dispatch(ActionSetScenario(scenario));
        }}
      />
      {/* 工程管理 */}
      <ProjectDisplayTable />
    </StyleProjectManager>
  );
};

const StyleProjectManager = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

RootWrapper(ProjectManager);
