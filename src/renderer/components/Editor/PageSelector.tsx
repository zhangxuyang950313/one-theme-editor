import React from "react";
import styled from "styled-components";
import {
  useCurrentResModule,
  useCurrentPageOption,
  useResourceImageUrl
} from "@/hooks/resource/index";
import { PreloadImage } from "@/components/ImageCollection";
import { TypePageOption } from "src/types/resource.config";
import { useEditorSelector } from "@/store";
import Previewer from "./Previewer";

const PagePreview: React.FC<{ pageOption: TypePageOption }> = props => {
  const { pageOption } = props;
  const resourceImageURL = useResourceImageUrl(pageOption.preview);
  const pageConfigMap = useEditorSelector(state => state.pageConfigMap);
  const [pageOpt, setPageOpt] = useCurrentPageOption();

  const pageConf = pageConfigMap[pageOption.src];

  return (
    <StylePreviewImage
      data-active={String(pageOpt.key === pageOption.key)}
      onClick={() => setPageOpt(pageOption)}
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
  width: 100%;
  /* flex-grow: 0; */
  /* width: 100%; */
  /* height: auto; */
  border: 1px solid;
  border-color: ${({ theme }) => theme["@border-color-base"]};
  border-radius: 6px;
  /* overflow: hidden; */
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
const PageSelector: React.FC<{ className: string }> = props => {
  const [{ pageList }] = useCurrentResModule();

  if (pageList.length === 0) return null;

  return (
    <div className={props.className}>
      <StylePageSelector>
        {pageList.map((page, index) => (
          <PagePreview key={index} pageOption={page} />
        ))}
      </StylePageSelector>
    </div>
  );
};

const StylePageSelector = styled.div`
  width: 120px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default PageSelector;
