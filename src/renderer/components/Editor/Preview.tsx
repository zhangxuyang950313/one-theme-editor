import { TypeTempPageConf } from "@/../types/project";
import React from "react";
import styled from "styled-components";

type TypeProps = {
  pageConf: TypeTempPageConf;
};
const Preview: React.FC<TypeProps> = (props: TypeProps) => {
  const { pageConf } = props;
  return (
    <StylePreview>
      <StyleImage src={pageConf.preview} alt={pageConf.pathname} />
    </StylePreview>
  );
};

const StyleImage = styled.img`
  width: 100%;
`;

const StylePreview = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 20px;
`;

export default Preview;
