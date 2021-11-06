import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useToggle } from "ahooks";
import { Button } from "@arco-design/web-react";
import { TypeProjectDataDoc } from "src/types/project";
import { TypeScenarioOption } from "src/types/scenario.config";
import CreateProject from "./CreateProject";
import ProjectList from "./ProjectList";

const ProjectListDisplay: React.FC<{
  scenarioOption: TypeScenarioOption;
}> = props => {
  const { scenarioOption } = props;
  const [projectList, setProjectList] = useState<TypeProjectDataDoc[]>([]);
  const [createProjectVisible, createProjectToggle] = useToggle(false);

  const fetchProjectList = useCallback(() => {
    window.$server.getProjectListByMd5(scenarioOption.md5).then(setProjectList);
  }, [scenarioOption]);

  useEffect(() => {
    if (!scenarioOption) return;
    fetchProjectList();
  }, [scenarioOption.md5]);

  return (
    <StyleProjectListDisplay>
      <div className="top-container">
        <div className="title">
          <h2>{scenarioOption?.name || ""}列表</h2>
          <p>
            新建{projectList.length > 0 ? "或选择" : ""}一个
            {scenarioOption.name}
            开始创作
          </p>
        </div>
        <Button
          type="primary"
          onClick={() => {
            // window.$server.openCreateProjectWindow(scenarioOption);
            createProjectToggle.setRight();
          }}
        >
          开始创作
        </Button>
      </div>
      <ProjectList list={projectList} />
      {/* 创建工程抽屉 */}
      <CreateProject
        visible={createProjectVisible}
        scenarioOption={scenarioOption}
        onCancel={createProjectToggle.toggle}
        onCreated={() => {
          fetchProjectList();
          createProjectToggle.setLeft();
        }}
      />
    </StyleProjectListDisplay>
  );
};

const StyleProjectListDisplay = styled.div`
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

export default ProjectListDisplay;
