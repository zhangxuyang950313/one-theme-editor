import React from "react";
import styled from "styled-components";

// components
import Sidebar from "@/components/Starter/Sidebar";
import ProjectManager from "@/components/Starter/ProjectManager";
import { useDocumentTitle } from "@/hooks";

// 开始页面
const Starter: React.FC = () => {
  const [, , setPresetTitle] = useDocumentTitle();
  setPresetTitle("main");

  return (
    <StyleHome>
      {/* 侧边栏 */}
      <Sidebar />
      {/* 工程管理 */}
      <ProjectManager />
    </StyleHome>
  );
};

const StyleHome = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
`;

export default Starter;
