import { useHistory } from "react-router";
import { useBrandOption } from "@/hooks/source";
import { useProjectList } from "@/hooks/project";
import { TypeProjectInfo } from "src/types/project";
import { LOAD_STATUS } from "src/enum";

import React from "react";
import styled from "styled-components";
import { Empty, Spin } from "antd";
import ProjectCard from "./ProjectCard";
import CreateProject from "./CreateProject";

const ProjectManager: React.FC<{
  status: LOAD_STATUS;
  onProjectCreated: (data: TypeProjectInfo) => Promise<void>;
}> = props => {
  const [brandConfig] = useBrandOption();
  const projectList = useProjectList();
  const history = useHistory();

  // 列表加载中、空、正常状态
  const ProjectListContent: React.FC = () => {
    switch (props.status) {
      // 加载状态
      case LOAD_STATUS.INITIAL:
      case LOAD_STATUS.LOADING: {
        return (
          <StyleCenterContainer>
            <Spin className="auto-margin" tip="加载中..." spinning />
          </StyleCenterContainer>
        );
      }
      case LOAD_STATUS.SUCCESS: {
        if (projectList.length > 0) {
          return (
            <StyleProjectList>
              {projectList.map((item, key) => (
                <div className="project-card" key={key}>
                  <ProjectCard
                    hoverable
                    projectInfo={item?.projectInfo}
                    onClick={() => {
                      history.push(`/editor/${item.uuid}`);
                    }}
                  />
                </div>
              ))}
            </StyleProjectList>
          );
        }
        // 空项目
        return (
          <StyleCenterContainer>
            <Empty
              className="auto-margin"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="空空如也，快去创建一个主题吧"
            />
          </StyleCenterContainer>
        );
      }
      default:
        return null;
    }
  };

  return (
    <StyleProjectManager>
      <div className="top-container">
        <div className="title">
          <h2>{brandConfig?.name || ""}列表</h2>
          <p>新建{projectList.length > 0 ? "或选择" : ""}一个主题开始创作</p>
        </div>
        <div className="button">
          {/* 新建主题按钮 */}
          <CreateProject onProjectCreated={props.onProjectCreated} />
        </div>
      </div>
      {/* 工程列表 */}
      <ProjectListContent />
    </StyleProjectManager>
  );
};

const StyleProjectManager = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  box-sizing: border-box;
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
        color: ${({ theme }) => theme["@text-color"]};
      }
      p {
        margin-top: 10px;
        font-size: 14px;
        color: ${({ theme }) => theme["@text-color-secondary"]};
      }
    }
    .button {
      display: flex;
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
`;

export default ProjectManager;
