import React from "react";
import styled from "styled-components";

import { useProjectData } from "@/hooks/project";
import { useSelectedModule } from "@/hooks/template";

import { Tooltip } from "antd";

// 模块选择器
const ModuleSelector: React.FC = () => {
  const [projectData] = useProjectData();
  const [currentModule, updateModule] = useSelectedModule();

  if (!currentModule) {
    console.log("currentModule 为空");
    return null;
  }
  console.log({ projectData });
  if (!Array.isArray(projectData?.template?.modules)) {
    console.log("modules 为空");
    return null;
  }

  return (
    <StyleModuleSelector>
      {projectData?.template?.modules.map((item, key) => {
        return (
          <StyleIcon
            key={key}
            isActive={currentModule.index === item.index}
            onClick={() => updateModule(item)}
          >
            <Tooltip title={item.name} placement="right">
              <img className="icon" alt="" src={item.icon} />
            </Tooltip>
          </StyleIcon>
        );
      })}
    </StyleModuleSelector>
  );
};

const StyleModuleSelector = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 100vh;
  overflow-y: auto;
  border-right: ${({ theme }) => theme["@border-color-base"]} 1px solid;
  padding: 80px 0;
`;
const StyleIcon = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  width: ${({ isActive }) => (isActive ? "55px" : "45px")};
  opacity: ${({ isActive }) => (isActive ? 1 : 0.4)};
  margin: 20px auto;
  &:hover {
    width: 60px;
  }
  transition: 0.4s all ease;
  .icon {
    width: 100%;
  }
  .name {
    font-size: 12px;
    text-align: center;
  }
`;

export default ModuleSelector;
