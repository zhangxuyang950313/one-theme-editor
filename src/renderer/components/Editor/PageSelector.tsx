import React from "react";
import styled from "styled-components";
import {
  useCurrentResModule,
  useCurrentPageOption,
  useResourceImageUrl,
  useCurrentPageConfig
} from "@/hooks/resource/index";
import { PreloadImage } from "@/components/ImageCollection";
import { TypeResPageOption } from "src/types/resource";
import Previewer from "./Previewer";

const PagePreview: React.FC<{ pageData: TypeResPageOption }> = props => {
  const { pageData } = props;
  const resourceImageURL = useResourceImageUrl(pageData.preview);
  const [pageOpt, setPageOpt] = useCurrentPageOption();
  const pageConf = useCurrentPageConfig();

  return (
    <StylePreviewImage data-active={String(pageOpt.key === pageData.key)}>
      {pageConf ? (
        <Previewer pageConfig={pageConf} />
      ) : (
        <PreloadImage
          className="preview-image"
          src={resourceImageURL}
          onClick={() => setPageOpt(pageData)}
        />
      )}
    </StylePreviewImage>
  );
};

const StylePreviewImage = styled.span`
  cursor: pointer;
  width: 48%;
  height: auto;
  margin: 1%;
  /* border: 1px solid;
  border-color: ${({ theme }) => theme["@border-color-base"]}; */
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
  opacity: 0.4;
  transition: 0.4s all;
  &[data-active="true"] {
    /* border: 1px solid;
    border-color: ${({ theme }) => theme["@primary-color"]}; */
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
  const [{ pageList }] = useCurrentResModule();

  if (pageList.length === 0) return null;

  return (
    <StylePagePreview>
      {pageList.map((page, index) => (
        <PagePreview key={index} pageData={page} />
      ))}
    </StylePagePreview>
  );
};

const StylePagePreview = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  width: 100%;
  height: 100%;
  overflow: hidden;
  flex-wrap: wrap;
  flex-grow: 0;
`;

export default PageSelector;
