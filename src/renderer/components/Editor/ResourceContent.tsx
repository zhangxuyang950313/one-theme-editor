import React from "react";
import styled from "styled-components";

import { useCurrentPage } from "@/hooks/template";

import ImageChanger from "./ImageChanger";

const ResourceContent: React.FC = () => {
  const [currentPage] = useCurrentPage();
  if (!currentPage) return null;
  return (
    <StyleResourceContent>
      {currentPage.source.map((sourceConf, key) => (
        <ImageChanger key={key} {...sourceConf} />
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
