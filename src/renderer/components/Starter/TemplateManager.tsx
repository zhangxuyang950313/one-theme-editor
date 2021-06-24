import React from "react";
import styled from "styled-components";

import { TypeTemplateConf } from "types/template";

// components
import { CheckCircleTwoTone } from "@ant-design/icons";
import { Empty, Spin } from "antd";
import TemplateCard from "./TemplateCard"; // 模板卡片单项

type TypeProps = {
  isLoading: boolean;
  templateList: TypeTemplateConf[];
  selectedTemp: TypeTemplateConf | undefined;
  onSelected: (config?: TypeTemplateConf) => void;
};

// 模板卡片管理
const TemplateManager: React.FC<TypeProps> = props => {
  const { templateList, selectedTemp, isLoading, onSelected } = props;

  if (isLoading) {
    return (
      <StyleTemplateManager>
        <Spin className="center" tip="加载中" />
      </StyleTemplateManager>
    );
  }

  if (templateList.length === 0) {
    return (
      <StyleTemplateManager>
        <Empty
          className="center"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`暂无模板`}
        />
      </StyleTemplateManager>
    );
  }

  return (
    <StyleTemplateManager>
      {templateList.map((template, key) => {
        const isActive = selectedTemp?.key === template.key;
        const isInit = !selectedTemp?.key;
        return (
          <StyleCardContainer
            key={key}
            isInit={isInit}
            isActive={isActive}
            onClick={() => {
              // 点选中的恢复初始状态
              onSelected(isActive ? undefined : template);
            }}
          >
            <TemplateCard hoverable config={template} />
            <CheckCircleTwoTone className="check-icon" />
          </StyleCardContainer>
        );
      })}
    </StyleTemplateManager>
  );
};

const StyleTemplateManager = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 50vh;
  overflow-y: auto;
  .center {
    margin: auto;
  }
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
