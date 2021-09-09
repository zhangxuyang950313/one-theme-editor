import React from "react";
import styled from "styled-components";
import { Empty } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { TypeSourceOption } from "src/types/source";
import { useSourceOptionList } from "@/hooks/source";
import SourceConfigCard from "./SourceConfigCard";

// 配置管理
const SourceConfigManager: React.FC<{
  selectedKey: string;
  onSelected: (config?: TypeSourceOption) => void;
}> = props => {
  // 模板列表
  const sourceOptionList = useSourceOptionList();

  if (sourceOptionList.length === 0) {
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
      {sourceOptionList.map((item, key) => {
        const isActive = props.selectedKey === item.key;
        const isInit = !props.selectedKey;
        return (
          <StyleCardContainer
            key={key}
            isInit={isInit}
            isActive={isActive}
            onClick={() => {
              // 点选中的恢复初始状态
              props.onSelected(isActive ? undefined : item);
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
  /* opacity: ${({ isInit, isActive }) =>
    0.5 + 0.5 * Number(isInit || isActive)};
  transition: 0.3s opacity ease-in; */
  position: relative;
  flex-shrink: 0;
  .check-icon {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 25px;
    opacity: ${({ isInit, isActive }) => Number(isActive || isInit)};
    transform: ${({ isActive }) => (isActive ? "scale(1)" : "scale(0)")};
    transition: 0.1s all ease;
  }
`;

export default SourceConfigManager;
