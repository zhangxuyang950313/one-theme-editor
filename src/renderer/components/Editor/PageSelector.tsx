import React from "react";
import styled from "styled-components";
import { Collapse } from "antd";
import {
  useResourcePageOption,
  useResourceImageUrl
} from "@/hooks/resource/index";
import { PreloadImage } from "@/components/ImageCollection";
import { TypeResPageOption } from "src/types/resource";
import { useEditorSelector } from "@/store";

const PagePreview: React.FC<{ pageData: TypeResPageOption }> = props => {
  const { pageData } = props;
  const resourceImageURL = useResourceImageUrl(pageData.preview);
  const [pageConf, setPageConf] = useResourcePageOption();

  return (
    <StylePreviewImage data-active={String(pageConf.key === pageData.key)}>
      <PreloadImage
        className="preview-image"
        src={resourceImageURL}
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
  const groupList = useEditorSelector(state => state.moduleConfig.groupList);

  if (groupList.length === 0) return null;

  return (
    <Collapse bordered={false} defaultActiveKey={Object.keys(groupList)}>
      {groupList.map(
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
