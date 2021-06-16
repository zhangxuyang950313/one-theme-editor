import React from "react";
import styled from "styled-components";

import { useSelectedPage } from "@/hooks/template";

import ImageChanger from "./ImageChanger";

const ResourceContext: React.FC = () => {
  const [currentPage] = useSelectedPage();
  if (!currentPage) return null;
  return (
    <StyleResourceContext>
      {currentPage.source.map((item, index) => (
        <ImageChanger key={index} data={item} />
      ))}
    </StyleResourceContext>
  );
};

const StyleResourceContext = styled.div`
  /* width: 280px; */
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
`;

export default ResourceContext;
