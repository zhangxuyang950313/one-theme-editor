import React from "react";
import styled from "styled-components";

import { TypeTempPageConf } from "types/project";
import ImageChanger from "./ImageChanger";

type TypeProps = {
  pageConf: TypeTempPageConf | undefined;
};
const ResourceContext: React.FC<TypeProps> = props => {
  if (!props.pageConf) return null;
  return (
    <StyleResourceContext>
      {props.pageConf.source.map((item, index) => (
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
