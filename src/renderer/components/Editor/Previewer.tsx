import React from "react";
import styled from "styled-components";

import { useCurrentPage } from "@/hooks/sourceConfig";
import { useGetSourceImageUrl } from "hooks/image";

const Preview: React.FC = () => {
  const [currentPage] = useCurrentPage();
  const getImageURL = useGetSourceImageUrl();

  if (!currentPage) return null;
  return (
    <StylePreviewer>
      <StyleImage src={getImageURL(currentPage.previewList[0])} alt="" />
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
