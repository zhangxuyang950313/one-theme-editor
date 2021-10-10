import React from "react";
import styled from "styled-components";
import {
  useCurrentResModule,
  useCurrentPageOption,
  useResourceImageUrl,
  useCurrentPageConfig
} from "@/hooks/resource/index";
import { PreloadImage } from "@/components/ImageCollection";
import { TypePageOption } from "src/types/resource.config";
import Previewer from "./Previewer";

const PagePreview: React.FC<{ pageData: TypePageOption }> = props => {
  const { pageData } = props;
  const resourceImageURL = useResourceImageUrl(pageData.preview);
  const [pageOpt, setPageOpt] = useCurrentPageOption();
  const pageConf = useCurrentPageConfig();

  return (
    <StylePreviewImage
      data-active={String(pageOpt.key === pageData.key)}
      onClick={() => setPageOpt(pageData)}
    >
      {pageConf ? (
        <Previewer pageConfig={pageConf} useDash={false} canClick={false} />
      ) : (
        <PreloadImage className="preview-image" src={resourceImageURL} />
      )}
    </StylePreviewImage>
  );
};

const StylePreviewImage = styled.span`
  cursor: pointer;
  margin: 5px 0;
  /* flex-grow: 0; */
  /* width: 100%; */
  /* height: auto; */
  /* border: 1px solid;
  border-color: ${({ theme }) => theme["@border-color-base"]}; */
  border-radius: 6px;
  overflow: hidden;
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
  width: 100%;
  overflow-y: auto;
  flex-wrap: nowrap;
  flex-grow: 0;
`;

export default PageSelector;
