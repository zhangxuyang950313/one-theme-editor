import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useCurrentPageConfig, useResourceList } from "@/hooks/resource/index";
import { useCreateWatcher } from "@/hooks/project/useSubscribeProjectFile";
import { RESOURCE_TAG } from "src/enum";
import { Tabs } from "@/components/One";
import FileBlocker from "./FileBlocker";
import XmlValueBlocker from "./XmlValueBlocker";

const ResourcePanel: React.FC = () => {
  useCreateWatcher();
  const pageConfig = useCurrentPageConfig();
  const resourceList = useResourceList();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentResourceList = resourceList[selectedIndex]?.children || [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [resourceList]);

  return (
    <StyleResourcePanel>
      {pageConfig?.disableTabs !== true && (
        <Tabs
          className="tabs"
          defaultIndex={0}
          data={resourceList.map((item, index) => ({
            index: index,
            label: item.name
          }))}
          onChange={index => setSelectedIndex(index)}
        />
      )}
      <div className="resource-container">
        {currentResourceList.map((resource, key) => {
          switch (resource.tag) {
            case RESOURCE_TAG.File: {
              return <FileBlocker key={key} data={resource} />;
            }
            case RESOURCE_TAG.String:
            case RESOURCE_TAG.Number:
            case RESOURCE_TAG.Color:
            case RESOURCE_TAG.Boolean: {
              return (
                <XmlValueBlocker key={key} className="item" data={resource} />
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
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }
`;

export default ResourcePanel;
