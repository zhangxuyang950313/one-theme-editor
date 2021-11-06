import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Menu } from "@arco-design/web-react";
import { TypeScenarioOption } from "src/types/scenario.config";
import TopInfo from "./TopInfo";

// 欢迎页侧边栏
const Sidebar: React.FC<{
  onScenarioChange: (x: TypeScenarioOption) => void;
}> = props => {
  // 场景列表
  const [scenarioList, setScenarioList] = useState<TypeScenarioOption[]>([]);

  // 获取场景配置列表
  useEffect(() => {
    window.$server.getScenarioOptionList().then(data => {
      setScenarioList(data);
    });
  }, []);

  // 场景列表变化恢复选中第一个
  useEffect(() => {
    if (!scenarioList[0]) return;
    props.onScenarioChange(scenarioList[0]);
  }, [scenarioList]);

  return (
    <StyleSidebar>
      {/*  编辑器信息展示 */}
      <TopInfo />
      {/* 场景选择 */}
      {scenarioList.length > 0 && (
        <Menu className="menu" defaultSelectedKeys={[scenarioList[0].md5]}>
          {scenarioList.map(item => (
            <Menu.Item
              key={item.md5}
              onClick={() => props.onScenarioChange(item)}
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
  border-right-color: ${({ theme }) => theme["@border-color-thirdly"]};
  background-color: var(--color-menu-light-bg);
  .menu {
    width: 100%;
    margin: auto;
  }
`;

export default Sidebar;
