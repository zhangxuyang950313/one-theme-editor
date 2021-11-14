import React, { useState, useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import { TypePageConfig } from "src/types/config.resource";
import { TypeLayoutElement } from "src/types/config.page";
import FillerWrapper from "./FillerWrapper";
import StickyTab from "@/components/StickyTab";
import { Tabs } from "@/components/one-ui";
import { previewResourceEmitter, PREVIEW_EVENT } from "@/singletons/emitters";

const ResourcePanel: React.FC<{
  pageConfig: TypePageConfig;
}> = props => {
  const { pageConfig } = props;
  const { resourceCategoryList } = pageConfig;
  const [selectTabIndex, setSelectTabIndex] = useState(0);

  // useLayoutEffect(() => {
  //   previewResourceEmitter.on(
  //     PREVIEW_EVENT.locateResource,
  //     (element: TypeLayoutElement) => {
  //       const index = resourceList.findIndex(
  //         item => item.key === element.sourceUrl
  //       );
  //       console.log(element);
  //       setSelectTabIndex(index);
  //       // PREVIEW_EVENT.locateResource
  //     }
  //   );
  // }, []);

  useEffect(() => {
    setSelectTabIndex(0);
  }, [resourceCategoryList]);

  return (
    <StyleResourcePanel>
      {pageConfig.disableTabs !== true && (
        <Tabs
          className="resource__tab"
          defaultIndex={selectTabIndex}
          data={resourceCategoryList.map((item, index) => ({
            index: index,
            label: item.name
          }))}
          onChange={index => setSelectTabIndex(index)}
        />
      )}
      <div className="resource__content">
        {(resourceCategoryList[selectTabIndex]?.children || []).map(
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
