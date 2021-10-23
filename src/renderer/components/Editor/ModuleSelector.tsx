import React from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import { useModuleConfig } from "@/hooks/resource/index";
import { useEditorSelector } from "@/store";
import { StaticResourceImage } from "../ImageCollection";

// 模块选择器
const ModuleSelector: React.FC<{ className?: string }> = props => {
  const resourceModuleList = useEditorSelector(
    state => state.resourceConfig.moduleList
  );
  const [currentModule, setCurrentModule] = useModuleConfig();

  return (
    <StyleModuleSelector className={props.className}>
      {resourceModuleList.map((item, key) => (
        <Tooltip key={key} title={item.name} placement="right">
          <div className="icon-wrapper" onClick={() => setCurrentModule(item)}>
            <StaticResourceImage
              className="icon"
              data-active={String(currentModule.index === item.index)}
              src={item.icon}
            />
          </div>
        </Tooltip>
      ))}
    </StyleModuleSelector>
  );
};

const StyleModuleSelector = styled.div`
  height: 100%;
  .icon-wrapper {
    width: 70px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      cursor: pointer;
      width: 45px;
      opacity: 0.4;
      transition: 0.4s all ease;
      &[data-active="true"] {
        width: 55px;
        opacity: 1;
      }
    }
    .name {
      font-size: 12px;
      text-align: center;
    }
  }
`;

export default ModuleSelector;
