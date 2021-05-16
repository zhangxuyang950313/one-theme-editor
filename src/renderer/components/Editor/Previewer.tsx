import { TypeTempPageConf } from "@/../types/project";
import React from "react";
import styled from "styled-components";

type TypeProps = {
  pageConf: TypeTempPageConf;
};
const Preview: React.FC<TypeProps> = (props: TypeProps) => {
  const { pageConf } = props;
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
