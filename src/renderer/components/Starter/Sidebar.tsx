import React from "react";
import styled from "styled-components";

import { Menu } from "antd";

import { useBrandConfList, useBrandConf } from "@/hooks/source";
import TopInfo from "./TopInfo";

// 欢迎页侧边栏
const Sidebar: React.FC = () => {
  const brandConfList = useBrandConfList();
  const [currentBrandConf, setCurrentBrandConf] = useBrandConf();

  const renderMenu = () => {
    if (!brandConfList || !currentBrandConf) return null;
    return (
      <Menu
        className="menu"
        selectedKeys={[currentBrandConf.type]}
        onSelect={v => {
          const brandInfo = brandConfList.find(o => v.key === o.type);
          if (brandInfo) setCurrentBrandConf(brandInfo);
        }}
      >
        {brandConfList.map(item => (
          <Menu.Item key={item.type}>{item.name}</Menu.Item>
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
