import React from "react";
import styled from "styled-components";

import { useCurrentPage } from "@/hooks/sourceConfig";
import { useSourceImageUrl } from "@/hooks";

const Preview: React.FC = () => {
  const [currentPage] = useCurrentPage();
  const getImageURL = useSourceImageUrl();
  if (!currentPage) return null;
  return (
    <StylePreviewer>
      <StyleImage src={getImageURL(currentPage.preview)} alt="" />
    </StylePreviewer>
  );
};

const StyleImage = styled.img`
  width: 100%;
`;

const StylePreviewer = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 20px;
`;

export default Preview;
