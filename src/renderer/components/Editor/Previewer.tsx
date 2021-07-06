import React from "react";
import styled from "styled-components";

import { usePageConf } from "@/hooks/source";
import { useSourceImageUrl } from "@/hooks/image";
import { PreloadImage } from "../ImageCollection";

const Preview: React.FC = () => {
  const [currentPage] = usePageConf();
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
  .img {
    width: 100%;
    border-radius: 12px;
  }
`;

export default Preview;
