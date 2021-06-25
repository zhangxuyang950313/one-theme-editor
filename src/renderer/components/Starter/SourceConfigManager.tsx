import React from "react";
import styled from "styled-components";

import { TypeSourceConfig } from "types/source-config";

// components
import { CheckCircleTwoTone } from "@ant-design/icons";
import { Empty, Spin } from "antd";
import SourceConfigCard from "./SourceConfigCard";

type TypeProps = {
  isLoading: boolean;
  sourceConfigList: TypeSourceConfig[];
  selectedConf: TypeSourceConfig | undefined;
  onSelected: (config?: TypeSourceConfig) => void;
};

// 配置管理
const SourceConfigManager: React.FC<TypeProps> = props => {
  const { sourceConfigList, selectedConf, isLoading, onSelected } = props;

  if (isLoading) {
    return (
      <StyleSourceConfigCard>
        <Spin className="center" tip="加载中" />
      </StyleSourceConfigCard>
    );
  }

  if (sourceConfigList.length === 0) {
    return (
      <StyleSourceConfigCard>
        <Empty
          className="center"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`暂无模板`}
        />
      </StyleSourceConfigCard>
    );
  }

  return (
    <StyleSourceConfigCard>
      {sourceConfigList.map((template, key) => {
        const isActive = selectedConf?.key === template.key;
        const isInit = !selectedConf?.key;
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
            <SourceConfigCard hoverable config={template} />
            <CheckCircleTwoTone className="check-icon" />
          </StyleCardContainer>
        );
      })}
    </StyleSourceConfigCard>
  );
};

const StyleSourceConfigCard = styled.div`
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

export default SourceConfigManager;
