import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useToggle } from "ahooks";
import { Button } from "@arco-design/web-react";
import { TypeProjectDataDoc } from "src/types/project";

import { useProjectManagerSelector } from "../store";

import CreateProject from "./CreateProject";
import ProjectList from "./ProjectList";

const ProjectDisplayTable: React.FC = () => {
  const scenario = useProjectManagerSelector(state => state.scenarioSelected);
  const [projectList, setProjectList] = useState<TypeProjectDataDoc[]>([]);
  const [visible, visibleToggle] = useToggle(false);

  const fetchProjectList = useCallback(() => {
    window.$one.$server
      .findProjectListByQuery({ scenarioSrc: scenario.src })
      .then(setProjectList);
  }, [scenario.src]);

  useEffect(() => {
    if (!scenario) return;
    fetchProjectList();
  }, [scenario.src]);

  return (
    <StyleProjectDisplayTable>
      <div className="top-container">
        <div className="title">
          <h2>{scenario?.name || ""}列表</h2>
          <p>
            新建{projectList.length > 0 ? "或选择" : ""}一个
            {scenario.name}
            开始创作
          </p>
        </div>
        <Button
          type="primary"
          onClick={() => {
            // window.$one.$server.openCreateProjectWindow(scenarioConfig);
            visibleToggle.setRight();
          }}
        >
          开始创作
        </Button>
      </div>
      <ProjectList list={projectList} />
      {/* 创建工程抽屉 */}
      <CreateProject
        drawerProps={{ visible, onCancel: visibleToggle.toggle }}
        onCreated={() => {
          fetchProjectList();
          visibleToggle.setLeft();
        }}
      />
    </StyleProjectDisplayTable>
  );
};

const StyleProjectDisplayTable = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  box-sizing: border-box;
  background-color: var(--color-bg-1);
  .top-container {
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    padding: 30px 30px 0 30px;
    .title {
      flex-shrink: 0;
      margin-right: 20px;
      h2 {
        color: var(--color-text-1);
      }
      p {
        margin-top: 10px;
        font-size: 14px;
        color: var(--color-text-3);
      }
    }
  }
`;

export default ProjectDisplayTable;
