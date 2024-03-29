import React from "react";
import styled from "styled-components";

import Logo from "@/assets/logo.png";

// 侧边栏顶部信息，暂时使用固定的
// TODO 用户信息
function TopInfo(): JSX.Element {
  return (
    <StyleEditorInfo>
      <img className="logo" alt="logo" src={Logo} />
      {/* <p className="title">一个主题编辑器</p> */}
      <p className="version">版本：{process.env.VERSION}</p>
    </StyleEditorInfo>
  );
}

// 编辑器信息
const StyleEditorInfo = styled.div`
  /* text-align: center; */
  margin: 30px;
  color: var(--color-text-1);
  .logo {
    width: 100px;
    /* height: 60px; */
    margin: 30px 0;
    filter: drop-shadow(0 0 5px var(--color-primary-light-4));
  }
  .title {
    font-size: 14px;
  }
  .version {
    font-size: 12px;
  }
`;

export default TopInfo;
