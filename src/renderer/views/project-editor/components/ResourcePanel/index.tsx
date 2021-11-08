import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TypePageConfig } from "src/types/resource.config";
import FillerWrapper from "./FillerWrapper";
import StickyTab from "@/components/StickyTab";
import { Tabs } from "@/components/one-ui";

const ResourcePanel: React.FC<{
  pageConfig: TypePageConfig;
}> = props => {
  const { pageConfig } = props;
  const { resourceList } = pageConfig;
  const [selectTabIndex, setSelectTabIndex] = useState(0);

  useEffect(() => {
    setSelectTabIndex(0);
  }, [resourceList]);

  return (
    <StyleResourcePanel>
      {pageConfig.disableTabs !== true && (
        <Tabs
          className="resource__tab"
          defaultIndex={selectTabIndex}
          data={resourceList.map((item, index) => ({
            index: index,
            label: item.name
          }))}
          onChange={index => setSelectTabIndex(index)}
        />
      )}
      <div className="resource__content">
        {(resourceList[selectTabIndex]?.children || []).map(
          (blockItem, key) => (
            <div className="resource__block" key={`${key}.${blockItem.key}`}>
              <StickyTab content={blockItem.name} />
              <FillerWrapper data={blockItem} />
            </div>
          )
        )}
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
  .resource__tab {
    padding: 0 10px;
  }
  .resource__content {
    display: flex;
    flex-grow: 0;
    flex-wrap: nowrap;
    flex-direction: column;
    /* padding: 20px; */
    overflow-x: hidden;
    overflow-y: auto;
    .resource__block {
      margin-top: 20px;
    }
  }
`;

export default ResourcePanel;
