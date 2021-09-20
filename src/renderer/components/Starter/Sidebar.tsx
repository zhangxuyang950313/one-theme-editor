import React from "react";
import styled from "styled-components";

import { Menu } from "antd";

import { useScenarioOption, useScenarioOptionList } from "@/hooks/source";
import TopInfo from "./TopInfo";

// 欢迎页侧边栏
const Sidebar: React.FC = () => {
  const scenarioOptionList = useScenarioOptionList();
  const [currentScenarioOption, setScenarioOption] = useScenarioOption();

  const ScenarioMenu: React.FC = () => {
    if (!scenarioOptionList || !currentScenarioOption) return null;
    return (
      <Menu
        className="menu"
        selectedKeys={[currentScenarioOption.md5]}
        onSelect={v => {
          const scenarioOption = scenarioOptionList.find(o => v.key === o.md5);
          if (scenarioOption) setScenarioOption(scenarioOption);
        }}
      >
        {scenarioOptionList.map(item => (
          <Menu.Item key={item.md5}>{item.name}</Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <StyleSidebar>
      {/*  编辑器信息展示 */}
      <TopInfo />
      {/* 场景选择 */}
      <StyleMenu>
        <ScenarioMenu />
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

// 场景菜单
const StyleMenu = styled.div`
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: 0px transparent !important;
  }
`;

export default Sidebar;
