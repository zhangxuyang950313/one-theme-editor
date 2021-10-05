import React, { useState } from "react";
import styled from "styled-components";
import { Tabs } from "antd";
import {
  useResDefinitionList,
  useResTypeConfigList
} from "@/hooks/resource/index";
import { RESOURCE_TYPE } from "src/enum";
import XmlValueHandler from "../XmlValueHandler";
import ImageHandler from "../ImageHandler/index";

const ResHandlerList: React.FC = () => {
  const resTypeList = useResTypeConfigList();
  const resourceList = useResDefinitionList();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const resourceCategory = resTypeList.map(resTypeConfig => {
    return resourceList.map((resource, key) => {
      if (resource.resType !== resTypeConfig.type) return null;
      // 和定义的 type 相同会被展示
      switch (resource.resType) {
        case RESOURCE_TYPE.IMAGE: {
          return <ImageHandler key={key} imageDefinition={resource} />;
        }
        case RESOURCE_TYPE.COLOR:
        case RESOURCE_TYPE.BOOLEAN:
        case RESOURCE_TYPE.STRING:
        case RESOURCE_TYPE.NUMBER: {
          return <XmlValueHandler key={key} xmlValueDefinition={resource} />;
        }
        default:
          return null;
      }
    });
  });

  return (
    <StyleResHandlerList>
      <Tabs onChange={index => setSelectedIndex(Number(index))}>
        {resTypeList.map((resTypeConfig, index) => {
          return <Tabs.TabPane key={index} tab={resTypeConfig.name} />;
        })}
      </Tabs>
      <div className="list">{resourceCategory[selectedIndex]}</div>
    </StyleResHandlerList>
  );
};

const StyleResHandlerList = styled.div`
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .list {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
`;

export default ResHandlerList;
