import React from "react";
import styled from "styled-components";

// components
import Sidebar from "@/components/Starter/Sidebar";
import ProjectManager from "@/components/Starter/ProjectManager";

// 开始页面
function Starter(): JSX.Element {
  return (
    <StyleHome>
      {/* 侧边栏 */}
      <Sidebar />
      {/* 主题管理 */}
      <ProjectManager />
    </StyleHome>
  );
}

const StyleHome = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
`;

export default Starter;
