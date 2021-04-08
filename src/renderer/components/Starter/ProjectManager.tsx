import React from "react";
import styled from "styled-components";

import { TypeBrandInfo } from "@/types/project";
import { useProjectList } from "@/hooks/project";

import { Empty, Spin } from "antd";
import ProjectCard from "./ProjectCard";
import CreateProject from "./CreateProject";

type TypeProps = {
  // 使用机型进行隔离查询
  brandInfo: TypeBrandInfo;
};
function ProjectManager(props: TypeProps): JSX.Element {
  const { brandInfo } = props;
  const [projects, refreshList, isLoading] = useProjectList(brandInfo);

  // 列表加载中、空、正常状态
  const getProjectListContent = () => {
    if (isLoading) {
      return (
        <Spin className="auto-margin" tip="加载中..." spinning={isLoading} />
      );
    }
    if (projects.length > 0) {
      return projects.map((item, key) => (
        <div className="project-card" key={key}>
          <ProjectCard hoverable projectInfo={item} />
        </div>
      ));
    }
    return (
      <Empty
        className="auto-margin"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="空空如也，快去创建一个主题吧"
      />
    );
  };

  return (
    <StyleProjectManager>
      <div className="top-container">
        <div className="title">
          <h2>{brandInfo?.name || ""}主题列表</h2>
          <p>新建{projects.length > 0 ? "或选择" : ""}一个主题开始创作</p>
        </div>
        <div className="button">
          {/* 新建主题按钮 */}
          <CreateProject onProjectCreated={refreshList} />
        </div>
      </div>
      {/* 工程列表 */}
      <StyleProjectList>{getProjectListContent()}</StyleProjectList>
    </StyleProjectManager>
  );
}

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
  height: 100%;
  overflow-y: auto;
  .auto-margin {
    margin: auto;
  }
  .project-card {
    width: 150px;
    height: 267px;
    margin: 0 20px 20px 0;
  }
`;

export default ProjectManager;
