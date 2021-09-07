import React from "react";
import styled from "styled-components";

import { Menu } from "antd";

import { useBrandOption, useBrandOptionList } from "@/hooks/source";
import TopInfo from "./TopInfo";

// 欢迎页侧边栏
const Sidebar: React.FC = () => {
  const brandOptionList = useBrandOptionList();
  const [brandOptionSelected, setBrandOption] = useBrandOption();

  const BrandMenu: React.FC = () => {
    if (!brandOptionList || !brandOptionSelected) return null;
    return (
      <Menu
        className="menu"
        selectedKeys={[brandOptionSelected.md5]}
        onSelect={v => {
          const brandOption = brandOptionList.find(o => v.key === o.md5);
          if (brandOption) setBrandOption(brandOption);
        }}
      >
        {brandOptionList.map(item => (
          <Menu.Item key={item.md5}>{item.name}</Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <StyleSidebar>
      {/*  编辑器信息展示 */}
      <TopInfo />
      {/* 品牌选择 */}
      <StyleMenu>
        <BrandMenu />
      </StyleMenu>
    </StyleSidebar>
  );
};

const StyleSidebar = styled.div`
  flex-shrink: 0;
  min-width: 200px;
  height: 100%;
  border-right: 1px solid;
  border-right-color: ${({ theme }) => theme["@border-color-base"]};
  background-color: ${({ theme }) => theme["@sidebar-color"]};
`;

// 品牌菜单
const StyleMenu = styled.div`
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: 0px transparent !important;
  }
`;

export default Sidebar;
