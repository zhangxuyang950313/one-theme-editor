import React from "react";
import styled from "styled-components";

import { useCurrentPage, useCurrentPageGroupList } from "@/hooks/sourceConfig";

import { Collapse } from "antd";
import { useGetSourceImageUrl } from "hooks/image";
import PreloadImage from "@/components/Image/PreloadImage";

// 页面选择器
const PageSelector: React.FC = () => {
  const pageGroupList = useCurrentPageGroupList();
  const [, setCurrentPage] = useCurrentPage();
  const sourceImageURL = useGetSourceImageUrl();
  if (pageGroupList.length === 0) {
    console.log("页面分组为空");
    return null;
  }
  return (
    <Collapse bordered={false} defaultActiveKey={Object.keys(pageGroupList)}>
      {pageGroupList.map((group, key) => (
        <Collapse.Panel header={group.name} key={key}>
          <StylePagePreview>
            {group.pageList.map((page, index) => (
              <PreloadImage
                className="preview-image"
                key={index}
                src={sourceImageURL(page.previewList[0])}
                onClick={() => setCurrentPage(page)}
              />
            ))}
          </StylePagePreview>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

const StylePagePreview = styled.div`
  display: flex;
  /* justify-content: space-around; */
  overflow: hidden;
  width: 100%;
  .preview-image {
    cursor: pointer;
    text-align: center;
    margin: 1%;
    width: 48%;
    border-radius: 6px;
  }
`;

export default PageSelector;
