import React from "react";
import styled from "styled-components";
import { Collapse } from "antd";
import {
  useSourcePageConf,
  useSourcePageGroupList,
  useSourceImageUrl
} from "@/hooks/source";
import { PreloadImage } from "@/components/ImageCollection";
import { TypeSourcePageConf } from "types/source";

const PagePreview: React.FC<{ pageData: TypeSourcePageConf }> = props => {
  const { pageData } = props;
  const sourceImageURL = useSourceImageUrl(pageData.preview);
  const [pageConf, setPageConf] = useSourcePageConf();

  return (
    <StylePreviewImage data-active={String(pageConf.key === pageData.key)}>
      <PreloadImage
        className="preview-image"
        src={sourceImageURL}
        onClick={() => setPageConf(pageData)}
      />
    </StylePreviewImage>
  );
};

const StylePreviewImage = styled.span`
  cursor: pointer;
  width: 48%;
  margin: 1%;
  border: 1px solid;
  border-color: ${({ theme }) => theme["@border-color-base"]};
  border-radius: 6px;
  overflow: hidden;
  opacity: 0.4;
  transition: 0.4s all;
  &[data-active="true"] {
    border: 1px solid;
    border-color: ${({ theme }) => theme["@primary-color"]};
    opacity: 1;
  }
  .preview-image {
    width: 100%;
    height: 100%;
    text-align: center;
    object-fit: cover;
  }
`;

// 页面选择器
const PageSelector: React.FC = () => {
  const pageGroupList = useSourcePageGroupList();

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
`;

export default PageSelector;
