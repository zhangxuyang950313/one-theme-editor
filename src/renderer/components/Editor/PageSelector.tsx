import React from "react";
import styled from "styled-components";

import { useCurrentPage, useCurrentPageGroupList } from "@/hooks/sourceConfig";

import { Collapse } from "antd";
import { useSourceImageUrl } from "hooks/image";

// 页面选择器
const PageSelector: React.FC = () => {
  const pageGroupList = useCurrentPageGroupList();
  const [, setCurrentPage] = useCurrentPage();
  const sourceImageURL = useSourceImageUrl();
  if (pageGroupList.length === 0) {
    console.log("页面分组为空");
    return null;
  }
  return (
    <Collapse bordered={false} defaultActiveKey={Object.keys(pageGroupList)}>
      {pageGroupList.map((group, key) => (
        <Collapse.Panel header={group.name} key={key}>
          <StylePagePreview>
            {group.pages.map((page, index) => (
              <StyleImage
                key={index}
                alt={page.preview}
                src={sourceImageURL(page.preview)}
                onClick={() => setCurrentPage(page)}
              />
            ))}
          </StylePagePreview>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

const StyleImage = styled.img`
  cursor: pointer;
  width: 48%;
  border-radius: 10px;
`;

const StylePagePreview = styled.div`
  display: flex;
  justify-content: space-around;
  overflow: hidden;
`;

export default PageSelector;
