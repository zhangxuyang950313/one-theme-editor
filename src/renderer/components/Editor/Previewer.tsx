import React from "react";
import styled from "styled-components";

import { useSourcePageConf, useSourceImageUrl } from "@/hooks/source";
import { PreloadImage } from "../ImageCollection";

const Preview: React.FC = () => {
  const [currentPage] = useSourcePageConf();
  const imageUrl = useSourceImageUrl(currentPage?.preview || "");

  return (
    <StylePreviewer>
      <PreloadImage className="img" src={imageUrl} />
    </StylePreviewer>
  );
};

const StylePreviewer = styled.div`
  width: 100%;
  border-radius: 12px;
  border: 1px solid;
  border-color: ${({ theme }) => theme["@border-color-base"]};
  overflow: hidden;
  .img {
    width: 100%;
  }
`;

export default Preview;
