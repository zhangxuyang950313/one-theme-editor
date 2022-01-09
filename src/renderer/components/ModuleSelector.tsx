import React, { useLayoutEffect } from "react";
import styled from "styled-components";

import { Tooltip } from "antd";

import StaticResourceImage from "./StaticResourceImage";

import type { TypeModuleConfig } from "src/types/config.resource";

// 模块选择器
const ModuleSelector: React.FC<{
  moduleSelect: TypeModuleConfig;
  moduleList: TypeModuleConfig[];
  onChange: (data: TypeModuleConfig) => void;
}> = props => {
  const { moduleSelect, moduleList, onChange } = props;

  // 缺省选中第一个
  useLayoutEffect(() => {
    if (!moduleSelect.name && moduleList[0]) {
      onChange(moduleList[0]);
    }
  }, [moduleList, moduleSelect.name, onChange]);

  return (
    <StyleModuleSelector>
      {moduleList.map((config, k) => (
        <Tooltip key={k} title={config.name} placement="right">
          <div className="icon-wrapper" onClick={() => onChange(config)}>
            <StaticResourceImage
              className="icon"
              is-active={String(
                `${k}-${config.name}` === `${k}-${moduleSelect.name}`
              )}
              src={config.icon}
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
      transition: 0.2s all ease-in;
      &[is-active="true"] {
        opacity: 1;
        filter: drop-shadow(0 0 5px var(--color-primary-light-4));
        transform: scale(1.2);
        transition: 0.2s all ease-out;
      }
    }
    .name {
      font-size: 12px;
      text-align: center;
    }
  }
`;

export default ModuleSelector;
