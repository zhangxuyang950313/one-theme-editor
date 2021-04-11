import React from "react";
import styled from "styled-components";

const ResourceContext: React.FC = () => {
  return <StyleResourceContext></StyleResourceContext>;
};

const StyleResourceContext = styled.div`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  border-left: 1px solid;
  border-left-color: ${({ theme }) => theme["@border-color-base"]};
`;

export default ResourceContext;
