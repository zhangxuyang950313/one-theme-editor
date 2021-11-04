import { remote } from "electron";
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Button, Empty } from "@arco-design/web-react";
import { TypeProjectDataDoc } from "src/types/project";
import { TypeScenarioOption } from "src/types/scenario.config";
import ProjectCard from "./ProjectCard";
import { useListenerBroadcast } from "@/hooks";

const ProjectManager: React.FC<{
  scenarioOption: TypeScenarioOption;
}> = props => {
  const { scenarioOption } = props;
  const [projectList, setProjectList] = useState<TypeProjectDataDoc[]>([]);

  const broadcast = useListenerBroadcast();

  const fetchProjectList = useCallback(() => {
    window.$server.getProjectListByMd5(scenarioOption.md5).then(setProjectList);
  }, [scenarioOption]);

  useEffect(() => {
    // 监听工程创建完成
    broadcast.onProjectCreated(fetchProjectList);
  }, []);

  useEffect(() => {
    console.log("props.scenarioMd5 change", scenarioOption);
    if (!scenarioOption) return;
    fetchProjectList();
  }, [scenarioOption]);

  return (
    <StyleProjectManager>
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
          onClick={() => window.$server.openCreateProjectWindow(scenarioOption)}
        >
          开始创作
        </Button>
      </div>
      {/* 工程列表 */}
      {projectList.length > 0 ? (
        <StyleProjectList>
          {projectList.map((item, key) => (
            <div className="project-card" key={key}>
              <ProjectCard
                hoverable
                data={item}
                onClick={async () => {
                  await window.$server.openProjectEditorWindow(item.uuid);
                  remote.getCurrentWindow().close();
                }}
              />
            </div>
          ))}
        </StyleProjectList>
      ) : (
        <StyleCenterContainer>
          <Empty className="auto-margin" description="空空如也，开始创作吧！" />
        </StyleCenterContainer>
      )}
    </StyleProjectManager>
  );
};

const StyleProjectManager = styled.div`
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

// 项目列表容器
const StyleProjectList = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 0;
  padding: 20px 30px 0 30px;
  overflow-y: auto;
  .project-card {
    margin: 0 20px 20px 0;
  }
`;

const StyleCenterContainer = styled.div`
  display: flex;
  flex-grow: 0;
  height: 100%;
  .auto-margin {
    margin: auto;
  }
  .ant-empty-description {
    color: var(--color-text-3);
  }
`;

export default ProjectManager;
