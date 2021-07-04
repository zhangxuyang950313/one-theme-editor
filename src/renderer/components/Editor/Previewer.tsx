import React from "react";
import styled from "styled-components";

import { useCurrentPage } from "@/hooks/source";
import { useGetSourceImageUrl } from "@/hooks/image";
import PreloadImage from "../Image/PreloadImage";

const Preview: React.FC = () => {
  const [currentPage] = useCurrentPage();
  const getImageURL = useGetSourceImageUrl();

  if (!currentPage) return null;
  return (
    <StylePreviewer>
      <PreloadImage className="img" src={getImageURL(currentPage.preview)} />
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
