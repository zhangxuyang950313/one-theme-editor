import React from "react";
import styled from "styled-components";
import { Empty } from "@arco-design/web-react";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { TypeResourceOption } from "src/types/resource.config";
import { useStarterSelector } from "@/store/starter";
import ResourceConfigCard from "./ResourceConfigCard";

// 配置管理
const ResourceConfigManager: React.FC<{
  selectedKey: string;
  onSelected: (config?: TypeResourceOption) => void;
}> = props => {
  // 配置列表
  const optionList = useStarterSelector(state => state.resourceOptionList);

  if (optionList.length === 0) {
    return (
      <StyleResourceConfigManager>
        <Empty className="center" description={`暂无模板`} />
      </StyleResourceConfigManager>
    );
  }

  return (
    <StyleResourceConfigManager>
      {optionList.map((item, key) => {
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
            <ResourceConfigCard resourceOption={item} />
            <CheckCircleTwoTone className="check-icon" />
          </StyleCardContainer>
        );
      })}
    </StyleResourceConfigManager>
  );
};

const StyleResourceConfigManager = styled.div`
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

export default ResourceConfigManager;
