import { TypeTempPageConf } from "@/../types/project";
import React from "react";
import styled from "styled-components";

type TypeProps = {
  pageConf: TypeTempPageConf | undefined;
};
const Preview: React.FC<TypeProps> = (props: TypeProps) => {
  const { pageConf } = props;
  if (!pageConf) return null;
  return (
    <StylePreviewer>
      <StyleImage src={pageConf.preview} alt={pageConf.pathname} />
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
