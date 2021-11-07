import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RESOURCE_TAG } from "src/enum";
import { TypePageConfig } from "src/types/resource.config";
import FileBlocker from "./FileBlocker";
import XmlValueBlocker from "./XmlValueBlocker";
import { Tabs } from "@/components/one-ui";

const ResourcePanel: React.FC<{
  pageConfig: TypePageConfig;
}> = props => {
  const { pageConfig } = props;
  const { resourceList } = pageConfig;
  const [selectTabIndex, setSelectTabIndex] = useState(0);

  const currentResourceList = resourceList[selectTabIndex]?.children || [];

  useEffect(() => {
    setSelectTabIndex(0);
  }, [resourceList]);

  return (
    <StyleResourcePanel>
      {pageConfig?.disableTabs !== true && (
        <Tabs
          className="tabs"
          defaultIndex={selectTabIndex}
          data={resourceList.map((item, index) => ({
            index: index,
            label: item.name
          }))}
          onChange={index => setSelectTabIndex(index)}
        />
      )}
      <div className="resource-container">
        {currentResourceList.map((resource, key) => {
          switch (resource.tag) {
            case RESOURCE_TAG.File: {
              return <FileBlocker key={key + resource.key} data={resource} />;
            }
            case RESOURCE_TAG.String:
            case RESOURCE_TAG.Number:
            case RESOURCE_TAG.Color:
            case RESOURCE_TAG.Boolean: {
              return (
                <XmlValueBlocker
                  key={key + resource.key}
                  className="item"
                  data={resource}
                  colorFormat={pageConfig.colorFormat}
                />
              );
            }
            default: {
              return null;
            }
          }
        })}
      </div>
    </StyleResourcePanel>
  );
};

const StyleResourcePanel = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .tabs {
    padding: 0 10px;
    flex-shrink: 0;
  }
  .image-container {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    flex-wrap: nowrap;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    .item {
      margin: 0 20px 20px 0;
    }
  }
  .resource-container {
    display: flex;
    flex-grow: 0;
    flex-wrap: nowrap;
    flex-direction: column;
    /* padding: 20px; */
    overflow-x: hidden;
    overflow-y: auto;
  }
`;

export default ResourcePanel;
