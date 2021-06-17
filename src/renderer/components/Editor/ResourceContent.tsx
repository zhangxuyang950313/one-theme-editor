import React from "react";
import styled from "styled-components";

import { useCurrentPage } from "@/hooks/template";

import ImageChanger from "./ImageChanger";

const ResourceContent: React.FC = () => {
  const [currentPage] = useCurrentPage();
  if (!currentPage) return null;
  return (
    <StyleResourceContent>
      {currentPage.source.map((item, index) => (
        <ImageChanger key={index} data={item} />
      ))}
    </StyleResourceContent>
  );
};

const StyleResourceContent = styled.div`
  /* width: 280px; */
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
`;

export default ResourceContent;
