import React from "react";
import styled from "styled-components";
import { Menu, MenuItem } from "@/components/One";

import { useScenarioOption } from "@/hooks/resource/index";
import { useStarterSelector } from "@/store/starter";
import TopInfo from "./TopInfo";

// 欢迎页侧边栏
const Sidebar: React.FC = () => {
  const scenarioOptionList = useStarterSelector(
    state => state.scenarioOptionList
  );
  const [scenarioOption, setScenarioOption] = useScenarioOption();

  return (
    <StyleSidebar>
      {/*  编辑器信息展示 */}
      <TopInfo />
      {/* 场景选择 */}
      <Menu className="menu" defaultKey={scenarioOption.md5 ?? ""}>
        {scenarioOptionList.map(item => (
          <MenuItem
            key={item.md5}
            $key={item.md5}
            onClick={() => setScenarioOption(item)}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </StyleSidebar>
  );
};

const StyleSidebar = styled.div`
  flex-shrink: 0;
  width: 230px;
  height: 100%;
  border-right: 1px solid;
  border-right-color: ${({ theme }) => theme["@border-color-thirdly"]};
  background-color: ${({ theme }) => theme["@sidebar-color"]};
  .menu {
    width: 80%;
    margin: auto;
  }
`;

export default Sidebar;
