import React from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import { TypeModuleConfig } from "src/types/resource.config";
import { StaticResourceImage } from "../ImageCollection";

// 模块选择器
const ModuleSelector: React.FC<{
  className?: string;
  moduleList: TypeModuleConfig[];
  currentModule: TypeModuleConfig;
  onChange: (data: TypeModuleConfig) => void;
}> = props => {
  const { className, moduleList, currentModule, onChange } = props;

  return (
    <StyleModuleSelector className={className}>
      {moduleList.map((item, key) => (
        <Tooltip key={key} title={item.name} placement="right">
          <div className="icon-wrapper" onClick={() => onChange(item)}>
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
      transition: 0.2s all ease-in;
      &[data-active="true"] {
        opacity: 1;
        width: 55px;
        transition: 0.3s all ease-out;
      }
    }
    .name {
      font-size: 12px;
      text-align: center;
    }
  }
`;

export default ModuleSelector;
