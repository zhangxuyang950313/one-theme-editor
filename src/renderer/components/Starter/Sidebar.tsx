import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { brandConfig } from "@/config";
import { getBrandInfo } from "@/store/modules/normalized/selector";

import { Menu } from "antd";
import TopInfo from "./TopInfo";

// 欢迎页侧边栏
function Sidebar(): JSX.Element {
  const [selectiveBrandInfo, setBrandInfo] = useSelector(getBrandInfo);
  return (
    <StyleSidebar>
      {/*  编辑器信息展示 */}
      <TopInfo />
      {/* 厂商选择 */}
      <StyleMenu>
        <Menu
          className="menu"
          defaultSelectedKeys={[selectiveBrandInfo.key]}
          onSelect={e => {
            const brandInfo = brandConfig.find(o => e.key === o.key);
            if (brandInfo) setBrandInfo(brandInfo);
          }}
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
  flex-shrink: 0;
  min-width: 200px;
  height: 100%;
  border-right: 1px solid;
  border-right-color: ${({ theme }) => theme["@border-color-base"]};
  background-color: ${({ theme }) => theme["@sidebar-color"]};
`;

// 厂商菜单
const StyleMenu = styled.div`
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: 0px transparent !important;
  }
`;

export default Sidebar;
