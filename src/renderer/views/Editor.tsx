import React from "react";
import { useParams } from "react-router";
import styled from "styled-components";

type TypeProps = {
  //
};
const Editor: React.FC<TypeProps> = props => {
  const params = useParams<{ pid: string }>();
  console.log(params);
  return <StyleEditor>aaa</StyleEditor>;
};

const StyleEditor = styled.div``;

export default Editor;
