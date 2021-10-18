import React, { useContext } from "react";
import styled from "styled-components";
import Context from "./Context";

const MenuItem: React.FC<
  React.HTMLAttributes<HTMLUListElement> & {
    $key: string;
    onClick?: (k: string) => void;
  }
> = props => {
  const state = useContext(Context);
  return (
    <StyleMenuItem
      data-active={state.currentKey === props.$key}
      onClick={() => {
        props.onClick && props.onClick(props.$key);
        state.setKey(props.$key);
      }}
    >
      <span>{props.children}</span>
    </StyleMenuItem>
  );
};
const StyleMenuItem = styled.ul`
  cursor: pointer;
  padding: 10px 20px;
  margin: 5px 0;
  color: ${({ theme }) => theme["@text-color"]};
  box-sizing: content-box;
  border-radius: 6px;
  transition: 0.3s all ease;
  &[data-active="true"] {
    transition: 0.3s all ease;
    color: black;
    /* background-color: ${({ theme }) => theme["@border-color-thirdly"]}; */
    background-color: ${({ theme }) => theme["@primary-color"]};
  }
`;

export default MenuItem;
