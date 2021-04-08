import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { getBrandInfo } from "@/store/modules/template/selector";

// components
import Sidebar from "@/components/Starter/Sidebar";
import ProjectManager from "@/components/Starter/ProjectManager";
import { setBrandInfo } from "@/store/modules/template/action";
import { useBrandInfoList } from "@/hooks/template";

// 开始页面
function Starter(): JSX.Element {
  const brandInfo = useSelector(getBrandInfo);
  const dispatch = useDispatch();
  const brandInfoList = useBrandInfoList();

  return (
    <StyleHome>
      {/* 侧边栏 */}
      <Sidebar
        brandInfoList={brandInfoList}
        defaultSelected={brandInfo}
        onSelect={data => dispatch(setBrandInfo(data))}
      />

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
