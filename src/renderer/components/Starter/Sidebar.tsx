import React from "react";
import styled from "styled-components";

import { Menu } from "antd";

import { useBrandOptionList, useBrandOption } from "@/hooks/source";
import TopInfo from "./TopInfo";

// 欢迎页侧边栏
const Sidebar: React.FC = () => {
  const brandConfList = useBrandOptionList();
  const [brandConf, setBrandConf] = useBrandOption();

  const renderMenu = () => {
    if (!brandConfList || !brandConf) return null;
    return (
      <Menu
        className="menu"
        selectedKeys={[brandConf.md5]}
        onSelect={v => {
          const brandOption = brandConfList.find(o => v.key === o.md5);
          if (brandOption) setBrandConf(brandOption);
        }}
      >
        {brandConfList.map(item => (
          <Menu.Item key={item.md5}>{item.name}</Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <StyleSidebar>
      {/*  编辑器信息展示 */}
      <TopInfo />
      {/* 厂商选择 */}
      <StyleMenu>{renderMenu()}</StyleMenu>
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

// 厂商菜单
const StyleMenu = styled.div`
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: 0px transparent !important;
  }
`;

export default Sidebar;
