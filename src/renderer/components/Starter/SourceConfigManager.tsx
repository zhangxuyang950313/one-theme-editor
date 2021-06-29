import React from "react";
import styled from "styled-components";

import { TypeSourceDescription } from "types/source-config";

// components
import { CheckCircleTwoTone } from "@ant-design/icons";
import { Empty, Spin } from "antd";
import SourceConfigCard from "./SourceConfigCard";

type TypeProps = {
  isLoading: boolean;
  sourceConfigList: TypeSourceDescription[];
  selectedSourceConfig: TypeSourceDescription | undefined;
  onSelected: (config?: TypeSourceDescription) => void;
};

// 配置管理
const SourceConfigManager: React.FC<TypeProps> = props => {
  const {
    sourceConfigList,
    selectedSourceConfig,
    isLoading,
    onSelected
  } = props;

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
      {sourceConfigList.map((item, key) => {
        const isActive = selectedSourceConfig?.key === item.key;
        const isInit = !selectedSourceConfig?.key;
        return (
          <StyleCardContainer
            key={key}
            isInit={isInit}
            isActive={isActive}
            onClick={() => {
              // 点选中的恢复初始状态
              onSelected(isActive ? undefined : item);
            }}
          >
            <SourceConfigCard hoverable sourceDescription={item} />
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
  height: 350px;
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