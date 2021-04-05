import React from "react";
import styled from "styled-components";

import { TypeTemplateConfig } from "@/types/project";

// components
import { CheckCircleTwoTone } from "@ant-design/icons";
import TemplateCard from "./TemplateCard"; // 模板卡片单项

type TypeProps = {
  templateList: TypeTemplateConfig[];
  selective?: TypeTemplateConfig;
  onSelected: (config?: TypeTemplateConfig) => void;
};

// 模板卡片管理
function TemplateManager(props: TypeProps): JSX.Element {
  return (
    <StyleTemplateManager>
      {props.templateList.map((template, key) => {
        const isActive = props.selective?.key === template.key;
        const isInit = !props.selective?.key;

        return (
          <StyleCardContainer
            isInit={isInit}
            isActive={isActive}
            onClick={() => {
              // 点选中的恢复初始状态
              props.onSelected(isActive ? undefined : template);
            }}
            key={key}
          >
            <TemplateCard hoverable config={template} />
            <CheckCircleTwoTone className="check-icon" />
          </StyleCardContainer>
        );
      })}
    </StyleTemplateManager>
  );
}

const StyleTemplateManager = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 50vh;
  overflow-y: auto;
`;

type TypeCardContainerProps = { isActive: boolean; isInit: boolean };
const StyleCardContainer = styled.div<TypeCardContainerProps>`
  width: 130px;
  height: 213px;
  margin: 10px;
  opacity: ${({ isInit, isActive }) => 0.5 + 0.5 * Number(isInit || isActive)};
  transition: 0.3s opacity ease-in;
  position: relative;
  .check-icon {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 25px;
    opacity: ${({ isActive }) => Number(isActive)};
    transform: ${({ isActive }) => (isActive ? "scale(1)" : "scale(0)")};
    transition: 0.1s all ease;
  }
`;

export default TemplateManager;
