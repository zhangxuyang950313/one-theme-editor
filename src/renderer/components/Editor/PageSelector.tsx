import React from "react";
import styled from "styled-components";
import { Collapse } from "antd";

import { useGetSourceImageUrl } from "@/hooks/image";
import { usePageConf, usePageGroupList } from "@/hooks/source";
import PreloadImage from "@/components/Image/PreloadImage";

// 页面选择器
const PageSelector: React.FC = () => {
  const sourceImageURL = useGetSourceImageUrl();
  const pageGroupList = usePageGroupList();
  const [, setPageConf] = usePageConf();

  if (pageGroupList.length === 0) {
    console.log("页面分组为空");
    return null;
  }

  return (
    <Collapse bordered={false} defaultActiveKey={Object.keys(pageGroupList)}>
      {pageGroupList.map(
        (group, key) =>
          group.pageList.length && (
            <Collapse.Panel header={group.name} key={key}>
              <StylePagePreview>
                {group.pageList.map((page, index) => (
                  <PreloadImage
                    className="preview-image"
                    key={index}
                    src={sourceImageURL(page.preview)}
                    onClick={() => setPageConf(page)}
                  />
                ))}
              </StylePagePreview>
            </Collapse.Panel>
          )
      )}
    </Collapse>
  );
};

const StylePagePreview = styled.div`
  display: flex;
  /* justify-content: space-around; */
  width: 100%;
  overflow: hidden;
  flex-wrap: wrap;
  .preview-image {
    cursor: pointer;
    text-align: center;
    margin: 1%;
    width: 48%;
    border-radius: 6px;
  }
`;

export default PageSelector;
