import React from "react";
import styled from "styled-components";

import { TypeTempPageConf } from "types/project";
import { StyleBorderRight } from "@/style";
import ImageChanger from "./ImageChanger";

type TypeProps = {
  pageConf: TypeTempPageConf;
};
const ResourceContext: React.FC<TypeProps> = props => {
  return (
    <StyleResourceContext>
      <StyleImageChanger>
        {props.pageConf.source.map((item, index) => (
          <ImageChanger key={index} data={item} />
        ))}
      </StyleImageChanger>
    </StyleResourceContext>
  );
};

const StyleResourceContext = styled.div`
  width: 280px;
  height: 100%;
  /* flex-grow: 1; */
  height: 100%;
  overflow: auto;
`;

const StyleImageChanger = styled(StyleBorderRight)``;

export default ResourceContext;
