import { useSelectedPage } from "@/hooks/project";
import React from "react";
import styled from "styled-components";

import ImageChanger from "./ImageChanger";

const ResourceContext: React.FC = () => {
  const [selectedPage] = useSelectedPage();
  if (!selectedPage) return null;
  return (
    <StyleResourceContext>
      {selectedPage.source.map((item, index) => (
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
