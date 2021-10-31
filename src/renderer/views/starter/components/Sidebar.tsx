import React from "react";
import styled from "styled-components";
import { Menu } from "@arco-design/web-react";

import { TypeScenarioOption } from "src/types/scenario.config";
import TopInfo from "./TopInfo";

// 欢迎页侧边栏
const Sidebar: React.FC<{
  scenarioOptionList: TypeScenarioOption[];
  onChange: (x: TypeScenarioOption) => void;
}> = props => {
  const { scenarioOptionList, onChange } = props;
  return (
    <StyleSidebar>
      {/*  编辑器信息展示 */}
      <TopInfo />
      {/* 场景选择 */}
      {scenarioOptionList.length > 0 && (
        <Menu
          className="menu"
          defaultSelectedKeys={[scenarioOptionList[0].md5]}
        >
          {scenarioOptionList.map(item => (
            <Menu.Item key={item.md5} onClick={() => onChange(item)}>
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
  border-right-color: ${({ theme }) => theme["@border-color-thirdly"]};
  background-color: var(--color-menu-light-bg);
  .menu {
    width: 100%;
    margin: auto;
  }
`;

export default Sidebar;
