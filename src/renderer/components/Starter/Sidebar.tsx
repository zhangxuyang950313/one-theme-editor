import React from "react";
import styled from "styled-components";

import { useBrandInfoList, useSelectedBrand } from "@/hooks/template";

import { Menu } from "antd";
import { useDispatch } from "react-redux";
import { ActionSetSelectedBrand } from "@/store/modules/template/action";
import TopInfo from "./TopInfo";

// 欢迎页侧边栏
const Sidebar: React.FC = props => {
  const brandInfoList = useBrandInfoList();
  const currentBrandInfo = useSelectedBrand();
  const dispatch = useDispatch();

  const renderMenu = () => {
    if (!brandInfoList || !currentBrandInfo) return null;
    return (
      <Menu
        className="menu"
        selectedKeys={[currentBrandInfo.templateDir]}
        onSelect={v => {
          const brandInfo = brandInfoList.find(o => v.key === o.templateDir);
          if (brandInfo) dispatch(ActionSetSelectedBrand(brandInfo));
        }}
      >
        {brandInfoList.map(item => (
          <Menu.Item key={item.templateDir}>{item.name}主题</Menu.Item>
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
