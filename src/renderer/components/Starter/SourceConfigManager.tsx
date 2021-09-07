import React, { useState } from "react";
import styled from "styled-components";
import { Empty, Spin } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { TypeSourceConfigPreview } from "src/types/source";
import { useSourceConfigPreviewList } from "@/hooks/source";
import SourceConfigCard from "./SourceConfigCard";

// 配置管理
const SourceConfigManager: React.FC<{
  onSelected: (config?: TypeSourceConfigPreview) => void;
}> = props => {
  // 模板列表
  const [sourceConfigList, isLoading] = useSourceConfigPreviewList();
  const [selectedConfKey, setSelectedConfKey] = useState("");

  if (isLoading) {
    return (
      <StyleSourceConfigManager>
        <Spin className="center" tip="加载中" />
      </StyleSourceConfigManager>
    );
  }

  if (sourceConfigList.length === 0) {
    return (
      <StyleSourceConfigManager>
        <Empty
          className="center"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`暂无模板`}
        />
      </StyleSourceConfigManager>
    );
  }

  return (
    <StyleSourceConfigManager>
      {sourceConfigList.map((item, key) => {
        const isActive = selectedConfKey === item.key;
        const isInit = !selectedConfKey;
        return (
          <StyleCardContainer
            key={key}
            isInit={isInit}
            isActive={isActive}
            onClick={() => {
              // 点选中的恢复初始状态
              props.onSelected(isActive ? undefined : item);
              setSelectedConfKey(isActive ? "" : item.key);
            }}
          >
            <SourceConfigCard sourceConfigPreview={item} />
            <CheckCircleTwoTone className="check-icon" />
          </StyleCardContainer>
        );
      })}
    </StyleSourceConfigManager>
  );
};

const StyleSourceConfigManager = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .center {
    margin: auto;
  }
`;

type TypeCardContainerProps = { isActive: boolean; isInit: boolean };
const StyleCardContainer = styled.div<TypeCardContainerProps>`
  width: 120px;
  margin: 10px;
  opacity: ${({ isInit, isActive }) => 0.5 + 0.5 * Number(isInit || isActive)};
  transition: 0.3s opacity ease-in;
  position: relative;
  flex-shrink: 0;
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
