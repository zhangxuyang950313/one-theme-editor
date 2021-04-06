import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import {
  getBrandInfo,
  getBrandInfoList
} from "@/store/modules/normalized/selector";
import { getBrandConfig } from "@/core/template-compiler";

// components
import Sidebar from "@/components/Starter/Sidebar";
import ProjectManager from "@/components/Starter/ProjectManager";

// 开始页面
function Starter(): JSX.Element {
  const [, setBrandInfoList] = useSelector(getBrandInfoList);
  const [, setBrandInfo] = useSelector(getBrandInfo);

  useEffect(() => {
    getBrandConfig().then(info => {
      setBrandInfoList(info);
      setBrandInfo(info[0]);
    });
  }, []);

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
