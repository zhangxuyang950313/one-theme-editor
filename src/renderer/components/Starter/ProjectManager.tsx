import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { addProject, getProjects, TypeProjectInfo } from "@/core/data";

import { getBrandInfo } from "@/store/modules/normalized/selector";

import { Button, Spin } from "antd";
import { useSelector } from "react-redux";
import ProjectCard from "./ProjectCard";

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
  const handleNewProduct = async () => {
    const info: TypeProjectInfo = {
      name: "我的主题",
      description: "描述",
      designer: "默认",
      author: "默认",
      uiVersion: "V12"
    };
    await addProject(info);
    refreshList();
    // modal.templateSelector();
    // Modal.confirm({
    //   title: "选择模板",
    //   onOk: () => {
    //     store.dispatch({
    //       type: UPDATE_SELECTED_TEMPLATE,
    //       payload: {
    //         template: templateList[0], // 暂选第1个模板
    //         uiVersion: templateList[0].uiVersions[1], // 暂选miui12
    //       },
    //     });
    //     history.push("editor");
    //   },
    // });
  };
  return (
    <StyleProjectManager>
      <div className="top-container">
        <div className="title">
          <h2>{brandInfo.name}主题列表</h2>
          <p>新建{projects.length > 0 ? "、选择" : ""}一个主题开始制作</p>
        </div>
        {/* 新建工程 */}
        <Button type="primary" onClick={handleNewProduct}>
          新建主题
        </Button>
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
