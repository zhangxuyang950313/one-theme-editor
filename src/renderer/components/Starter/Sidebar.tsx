import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { TypeBrandInfo } from "@/types/project";

import { Menu } from "antd";
import TopInfo from "./TopInfo";

type TypeProps = {
  brandInfoList: TypeBrandInfo[];
  defaultSelected: TypeBrandInfo;
  onSelect: (data: TypeBrandInfo) => void;
};
// 欢迎页侧边栏
function Sidebar(props: TypeProps): JSX.Element {
  const { brandInfoList, defaultSelected, onSelect } = props;

  const renderMenu = () => {
    if (brandInfoList) {
      const menuItem = brandInfoList.map(item => (
        <Menu.Item key={item.templateDir}>{item.name}主题</Menu.Item>
      ));
      return (
        <Menu
          className="menu"
          selectedKeys={[defaultSelected.templateDir]}
          onSelect={v => {
            const brandInfo = brandInfoList.find(o => v.key === o.templateDir);
            if (brandInfo) onSelect(brandInfo);
          }}
        >
          {menuItem}
        </Menu>
      );
    }
    return null;
  };

  return (
    <StyleSidebar>
      {/*  编辑器信息展示 */}
      <TopInfo />
      {/* 厂商选择 */}
      <StyleMenu>{renderMenu()}</StyleMenu>
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
