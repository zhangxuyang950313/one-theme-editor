import React, { useState } from "react";
import styled from "styled-components";
import { Tabs } from "antd";
import {
  useResDefinitionList,
  useResTypeConfigList
} from "@/hooks/resource/index";
import { RESOURCE_TYPE } from "src/enum";
import XmlValueHandler from "./ResourceHandler/XmlValueHandler";
import ImageHandler from "./ResourceHandler/ImageHandler";

const ResourceHandler: React.FC = () => {
  const resTypeList = useResTypeConfigList();
  const resourceList = useResDefinitionList();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const resourceCategory = resTypeList.map(resTypeConfig => {
    return resourceList.map((resource, key) => {
      if (resource.resType !== resTypeConfig.type) return null;
      // 和定义的 type 相同会被展示
      switch (resource.resType) {
        case RESOURCE_TYPE.IMAGE: {
          return <ImageHandler className="item" key={key} data={resource} />;
        }
        case RESOURCE_TYPE.COLOR:
        case RESOURCE_TYPE.BOOLEAN:
        case RESOURCE_TYPE.STRING:
        case RESOURCE_TYPE.NUMBER: {
          return <XmlValueHandler className="item" key={key} data={resource} />;
        }
        default:
          return null;
      }
    });
  });

  return (
    <StyleResourceHandler>
      <Tabs
        className="tabs"
        onChange={index => setSelectedIndex(Number(index))}
      >
        {resTypeList.map((resTypeConfig, index) => {
          return <Tabs.TabPane key={index} tab={resTypeConfig.name} />;
        })}
      </Tabs>
      <div className="resource-container">
        {resourceCategory[selectedIndex]}
      </div>
    </StyleResourceHandler>
  );
};

const StyleResourceHandler = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .tabs {
    padding: 0 20px;
    flex-shrink: 0;
    .ant-tabs-nav {
      margin: 0 0 10px 0;
    }
  }
  .resource-container {
    display: flex;
    flex-grow: 0;
    flex-wrap: wrap;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    .item {
      margin: 0 20px 20px 0;
    }
  }
`;

export default ResourceHandler;
