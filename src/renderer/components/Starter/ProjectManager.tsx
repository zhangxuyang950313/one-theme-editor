import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { getProjects, TypeProjectInfo } from "@/core/data";

import { getBrandInfo } from "@/store/modules/normalized/selector";

import { Spin } from "antd";
import { useSelector } from "react-redux";
import ProjectCard from "./ProjectCard";
import CreateProject from "./CreateProject";

function ProjectManager(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<TypeProjectInfo[]>([]);
  const [brandInfo] = useSelector(getBrandInfo);

  useEffect(() => {
    refreshList();
  }, []);

  // 刷新工程列表
  const refreshList = async () => {
    const p = await getProjects();
    setTimeout(() => {
      setProjects(p);
      setLoading(false);
    }, 500);
  };
  return (
    <StyleProjectManager>
      <div className="top-container">
        <div className="title">
          <h2>{brandInfo.name}主题列表</h2>
          <p>新建{projects.length > 0 ? "或选择" : ""}一个主题开始创作</p>
        </div>
        {/* 新建工程 */}
        <CreateProject refreshList={refreshList} />
      </div>
      {/* 工程列表 */}
      <StyleProjectList>
        {loading ? (
          <Spin className="spin" tip="加载中..." spinning={loading} />
        ) : (
          projects.map((item, key) => (
            <ProjectCard projectInfo={item} key={key} />
          ))
        )}
      </StyleProjectList>
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
    justify-content: space-between;
    align-items: center;
    padding: 30px 30px 0 30px;
    .title {
      h2 {
        color: ${({ theme }) => theme["@text-color"]};
      }
      p {
        margin-top: 10px;
        font-size: 14px;
        color: ${({ theme }) => theme["@text-color-secondary"]};
      }
    }
  }
`;

// 历史项目
const StyleProjectList = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 0;
  padding: 20px 30px 0 30px;
  height: 100%;
  overflow-y: auto;
  .spin {
    margin: auto;
  }
`;

export default ProjectManager;
