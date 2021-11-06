import path from "path";
import React from "react";
import styled from "styled-components";
import { Descriptions, Empty } from "@arco-design/web-react";
import { TypeResourceConfig } from "src/types/resource.config";
import { PreloadImage } from "./ImageCollection";

// 配置卡片
export const ResourceConfigCard: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    resourceConfig: TypeResourceConfig;
  }
> = props => {
  const { resourceConfig } = props;
  const { namespace, preview } = resourceConfig;
  const resourceDir =
    window.$electronStore.config.get("pathConfig").RESOURCE_CONFIG_DIR;

  return (
    <StyleResourceConfigCard {...props}>
      <PreloadImage
        className="preview"
        src={`local://${path.join(resourceDir, namespace, preview)}`}
      />
      <Descriptions
        className="description"
        column={1}
        size="mini"
        border
        title={resourceConfig.name}
        data={[
          { label: "版本", value: resourceConfig.version },
          { label: "UI版本", value: resourceConfig.uiVersion.name },
          {
            label: `模块(${resourceConfig.moduleList.length})`,
            value: resourceConfig.moduleList
              .map(_ => `${_.name || "-"}(${_.pageList.length})`)
              .join("、")
          }
        ]}
      />
    </StyleResourceConfigCard>
  );
};

const StyleResourceConfigCard = styled.div`
  cursor: pointer;
  color: var(--color-text-1);
  display: flex;
  padding: 4px;
  height: 100%;
  .preview {
    height: 100%;
    border-radius: 5px;
    border: 1px solid var(--color-secondary);
    object-fit: cover;
  }
  .description {
    padding: 10px;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

// 配置管理
const ResourceConfigList: React.FC<{
  resourceConfigList: TypeResourceConfig[];
  selectedKey: string;
  onSelected: (config?: TypeResourceConfig) => void;
}> & { Card: typeof ResourceConfigCard } = props => {
  return (
    <StyleResourceConfigList>
      {props.resourceConfigList.length ? (
        props.resourceConfigList.map((item, key) => {
          const isActive = props.selectedKey === item.key;
          const isInit = !props.selectedKey;
          return (
            <div
              className="card-container"
              key={key}
              data-init={isInit}
              data-active={isActive}
              onClick={() => {
                // 点选中的恢复初始状态
                props.onSelected(isActive ? undefined : item);
              }}
            >
              <ResourceConfigCard resourceConfig={item} />
            </div>
          );
        })
      ) : (
        <div className="empty">
          <Empty description="暂无模板" />
        </div>
      )}
    </StyleResourceConfigList>
  );
};

const StyleResourceConfigList = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  .empty {
    margin: auto;
  }
  .card-container {
    width: 100%;
    height: 210px;
    margin-bottom: 20px;
    position: relative;
    flex-shrink: 0;
    transition: 0.1s all ease;
    border: 2px solid;
    overflow: hidden;
    background-color: var(--color-bg);
    border-radius: 8px;
    border-color: var(--color-secondary);
    &[data-active="true"] {
      border-color: var(--color-primary-light-4);
    }
  }
`;

ResourceConfigList.Card = ResourceConfigCard;

export default ResourceConfigList;
