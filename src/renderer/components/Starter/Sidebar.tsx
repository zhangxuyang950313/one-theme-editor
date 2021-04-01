import React, { useEffect } from "react";
import styled from "styled-components";

import Logo from "@/assets/logo.png";

// 欢迎页侧边栏
function Sidebar(): JSX.Element {
  useEffect(() => {
    console.log(process.env.NODE_ENV);
    console.log(process.env.VERSION);
  });
  return (
    <StyleSidebar>
      {/*  编辑器信息展示 */}
      <StyleEditorInfo>
        <img className="logo" alt="logo" src={Logo} />
        <p className="title">一个主题编辑器</p>
        <p className="version">版本：{process.env.VERSION}</p>
      </StyleEditorInfo>
    </StyleSidebar>
  );
}

const StyleSidebar = styled.div`
  width: 200px;
  height: 100%;
  border-right: 1px rgba(0, 0, 0, 0.1) solid;
  background-color: ${({ theme }) => theme["@sidebar-color"]};
`;

const StyleEditorInfo = styled.div`
  text-align: center;
  margin: 30px;
  .logo {
    width: 60px;
    margin: 10px;
  }
  .title {
    font-size: 14px;
  }
  .version {
    font-size: 12px;
  }
`;

export default Sidebar;
