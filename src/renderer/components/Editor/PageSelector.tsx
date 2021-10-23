import React from "react";
import styled from "styled-components";
import { usePageOption, useResourceImageUrl } from "@/hooks/resource/index";
import { PreloadImage } from "@/components/ImageCollection";
import { TypePageOption } from "src/types/resource.config";
import { useEditorSelector } from "@/store";
import Previewer from "./Previewer";

const PagePreview: React.FC<{ pageOption: TypePageOption }> = props => {
  const { pageOption } = props;
  const resourceImageURL = useResourceImageUrl(pageOption.preview);
  const pageConfigMap = useEditorSelector(state => state.pageConfigMap);
  const [pageOpt, setPageOpt] = usePageOption();

  const pageConf = pageConfigMap[pageOption.src];

  return (
    <StylePreviewImage
      data-active={String(pageOpt.key === pageOption.key)}
      onClick={() => setPageOpt(pageOption)}
    >
      {pageConf ? (
        <Previewer
          className="previewer"
          pageConfig={pageConf}
          useDash={false}
          canClick={false}
        />
      ) : (
        <PreloadImage className="preview-image" src={resourceImageURL} />
      )}
    </StylePreviewImage>
  );
};

const StylePreviewImage = styled.span`
  cursor: pointer;
  width: 100%;
  margin: 5px 0;
  padding: 2px;
  opacity: 0.4;
  border-radius: 6px;
  box-sizing: border-box;
  border: 1px solid;
  &[data-active="true"] {
    border-color: ${({ theme }) => theme["@primary-color"]};
    opacity: 1;
  }
  .previewer {
    border-radius: 6px;
    overflow: hidden;
    box-sizing: border-box;
  }
  .preview-image {
    border-radius: 6px;
    overflow: hidden;
    text-align: center;
    object-fit: cover;
  }
`;

// 页面选择器
const PageSelector: React.FC<{
  className?: string;
  pageList: TypePageOption[];
}> = props => {
  const { pageList } = props;

  return (
    <StylePageSelector className={props.className}>
      {pageList.map((page, index) => (
        <PagePreview key={index} pageOption={page} />
      ))}
    </StylePageSelector>
  );
};

const StylePageSelector = styled.div`
  display: flex;
  flex-direction: column;
`;

export default PageSelector;
