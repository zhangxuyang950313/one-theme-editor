import path from "path";
import React from "react";
import styled from "styled-components";
import { Empty } from "@arco-design/web-react";
import { TypeResourceOption } from "src/types/resource.config";
import { LazyImage } from "./ImageCollection";

type TypeProps = {
  resourceOption: TypeResourceOption;
};

// 配置卡片
export const ResourceConfigCard: React.FC<TypeProps> = props => {
  const { resourceOption } = props;
  const { namespace, preview } = resourceOption;
  const resourceDir =
    window.$electronStore.config.get("pathConfig").RESOURCE_CONFIG_DIR;
  return (
    <StyleResourceConfigCard>
      <LazyImage
        style={{ width: "100%" }}
        src={`local://${path.join(resourceDir, namespace, preview)}`}
      />
      {/* <div className="r-title">{resourceOption.name}</div>
      <div className="r-desc">{resourceOption.uiVersion.name}</div> */}
    </StyleResourceConfigCard>
  );
};

const StyleResourceConfigCard = styled.div`
  cursor: pointer;
  color: var(--color-text-1);
`;

// 配置管理
const ResourceConfigManager: React.FC<{
  className: string;
  resourceOptionList: TypeResourceOption[];
  selectedKey: string;
  onSelected: (config?: TypeResourceOption) => void;
}> & { Card: typeof ResourceConfigCard } = props => {
  if (props.resourceOptionList.length === 0) {
    return (
      <StyleResourceConfigManager>
        <Empty className="center" description={`暂无模板`} />
      </StyleResourceConfigManager>
    );
  }

  return (
    <StyleResourceConfigManager className={props.className}>
      {props.resourceOptionList.map((item, key) => {
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
  overflow-y: auto;
  .center {
    margin: auto;
  }
`;

type TypeCardContainerProps = { isActive: boolean; isInit: boolean };
const StyleCardContainer = styled.div<TypeCardContainerProps>`
  width: 120px;
  margin: 0 10px 10px 0;
  /* opacity: ${({ isInit, isActive }) =>
    0.5 + 0.5 * Number(isInit || isActive)};
  transition: 0.3s opacity ease-in; */
  position: relative;
  flex-shrink: 0;
  transition: 0.1s all ease;
  border: 2px solid;
  border-color: ${({ isActive }) =>
    isActive ? "var(--color-primary-light-4)" : "var(--color-border-1)"};
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--color-bg);
`;
ResourceConfigManager.Card = ResourceConfigCard;

export default ResourceConfigManager;
