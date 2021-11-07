import React from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import { TypeModuleConfig } from "src/types/resource.config";
import { StaticResourceImage } from "./DynamicImage";

// 模块选择器
const ModuleSelector: React.FC<{
  className?: string;
  moduleConfigList: TypeModuleConfig[];
  currentModule: TypeModuleConfig;
  onChange: (data: TypeModuleConfig) => void;
}> = props => {
  const { className, moduleConfigList, currentModule, onChange } = props;

  return (
    <StyleModuleSelector className={className}>
      {moduleConfigList.map((item, key) => (
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
    /* width: 70px; */
    width: 100%;
    height: 70px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      cursor: pointer;
      width: 46px;
      opacity: 0.4;
      transition: 0.2s all ease;
      &[data-active="true"] {
        opacity: 1;
        filter: drop-shadow(0 0 5px var(--color-primary-light-4));
        transform: scale(1.2);
        transition: 0.2s all ease;
      }
    }
    .name {
      font-size: 12px;
      text-align: center;
    }
  }
`;

export default ModuleSelector;
