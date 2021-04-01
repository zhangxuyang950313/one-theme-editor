import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { brandConfig } from "@/config";
import { getBrandInfo } from "@/store/modules/normalized/selector";

import { Menu } from "antd";

import Logo from "@/assets/logo.png";

// 欢迎页侧边栏
function Sidebar(): JSX.Element {
  const [selectiveBrandInfo, setBrandInfo] = useSelector(getBrandInfo);
  return (
    <StyleSidebar>
      {/*  编辑器信息展示 */}
      <StyleEditorInfo>
        <img className="logo" alt="logo" src={Logo} />
        <p className="title">一个主题编辑器</p>
        <p className="version">版本：{process.env.VERSION}</p>
      </StyleEditorInfo>
      {/* 厂商选择 */}
      <StyleMenu>
        <Menu
          defaultSelectedKeys={[selectiveBrandInfo.key]}
          onSelect={e => console.log(e)}
        >
          {brandConfig.map(item => (
            <Menu.Item key={item.key}>{item.name}</Menu.Item>
          ))}
        </Menu>
      </StyleMenu>
    </StyleSidebar>
  );
}

const StyleSidebar = styled.div`
  width: 200px;
  height: 100%;
  border-right: 1px rgba(0, 0, 0, 0.1) solid;
  background-color: ${({ theme }) => theme["@sidebar-color"]};
`;

// 编辑器信息
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

// 厂商菜单
const StyleMenu = styled.div``;

export default Sidebar;
