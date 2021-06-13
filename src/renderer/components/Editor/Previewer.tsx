import React from "react";
import styled from "styled-components";

import { useSelectedPage } from "@/hooks/template";

const Preview: React.FC = () => {
  const [selectedPage] = useSelectedPage();
  if (!selectedPage) return null;
  return (
    <StylePreviewer>
      <StyleImage src={selectedPage.preview} alt={selectedPage.pathname} />
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
