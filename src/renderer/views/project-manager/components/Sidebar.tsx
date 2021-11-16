import React, { useEffect } from "react";
import styled from "styled-components";
import { Menu } from "@arco-design/web-react";
import { TypeScenarioOption } from "src/types/config.scenario";

import TopInfo from "./TopInfo";

// 欢迎页侧边栏
const Sidebar: React.FC<{
  scenarioList: TypeScenarioOption[];
  onScenarioChange: (x: TypeScenarioOption) => void;
}> = props => {
  const { scenarioList, onScenarioChange } = props;

  // 场景列表变化恢复选中第一个
  useEffect(() => {
    if (!scenarioList[0]) return;
    onScenarioChange(scenarioList[0]);
  }, [scenarioList]);

  return (
    <StyleSidebar>
      {/*  编辑器信息展示 */}
      <TopInfo />
      {/* 场景选择 */}
      {scenarioList.length > 0 && (
        <Menu
          className="menu"
          defaultSelectedKeys={[`${0}.${scenarioList[0].src}`]}
        >
          {scenarioList.map((item, key) => (
            <Menu.Item
              key={`${key}.${item.src}`}
              onClick={() => onScenarioChange(item)}
            >
              {item.name}
            </Menu.Item>
          ))}
        </Menu>
      )}
    </StyleSidebar>
  );
};

const StyleSidebar = styled.div`
  flex-shrink: 0;
  width: 230px;
  height: 100%;
  border-right: 1px solid;
  border-right-color: var(--color-border);
  background-color: var(--color-menu-light-bg);
  .menu {
    width: 100%;
    margin: auto;
  }
`;

export default Sidebar;
