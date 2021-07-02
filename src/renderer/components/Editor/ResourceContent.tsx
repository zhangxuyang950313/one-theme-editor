import React from "react";
import styled from "styled-components";

import { useCurrentPage } from "@/hooks/sourceConfig";

import ImageController from "@/components/ImageController/index";

const ResourceContent: React.FC = () => {
  const [currentPage] = useCurrentPage();

  if (!currentPage) return null;
  const imageElements = currentPage.elementList.flatMap(item =>
    item.type === "image" ? [item] : []
  );
  return (
    <StyleResourceContent>
      {imageElements.map((sourceConf, key) => (
        <ImageController key={key} {...sourceConf} />
      ))}
    </StyleResourceContent>
  );
};

const StyleResourceContent = styled.div`
  width: 320px;
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
`;

export default ResourceContent;
