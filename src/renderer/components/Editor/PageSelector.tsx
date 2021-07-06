import React from "react";
import styled from "styled-components";
import { Collapse } from "antd";
import { useSourceImageUrl } from "@/hooks/image";
import { usePageConf, usePageGroupList } from "@/hooks/source";
import { PreloadImage } from "@/components/ImageCollection";
import { TypeSourcePageConf } from "types/source-config";

const PagePreview: React.FC<{ pageData: TypeSourcePageConf }> = props => {
  const sourceImageURL = useSourceImageUrl(props.pageData.preview);
  const [, setPageConf] = usePageConf();

  return (
    <PreloadImage
      className="preview-image"
      src={sourceImageURL}
      onClick={() => setPageConf(props.pageData)}
    />
  );
};

// 页面选择器
const PageSelector: React.FC = () => {
  const pageGroupList = usePageGroupList();

  if (pageGroupList.length === 0) return null;

  return (
    <Collapse bordered={false} defaultActiveKey={Object.keys(pageGroupList)}>
      {pageGroupList.map(
        (group, key) =>
          group.pageList.length && (
            <Collapse.Panel header={group.name} key={key}>
              <StylePagePreview>
                {group.pageList.map((page, index) => (
                  <PagePreview key={index} pageData={page} />
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
