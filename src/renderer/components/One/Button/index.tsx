import React from "react";
import styled from "styled-components";

type TypeButtonProps = React.HTMLAttributes<HTMLSpanElement> & {
  type?: "primary";
  icon?: React.ReactNode;
  disabled?: boolean;
};

const Button: React.FC<TypeButtonProps> = props => {
  return <StyleButton {...props}>{props.children}</StyleButton>;
};

const StyleButton = styled.span<TypeButtonProps>`
  display: inline-block;
  flex-shrink: 0;
  cursor: pointer;
  padding: 6px 12px;
  background: ${({ type, theme }) =>
    type === "primary" ? theme["@primary-color"] : theme["@text-color"]};
  border: transparent;
  border-radius: 6px;
  outline: none;
  transition: 0.3s ease;
  &:hover {
    opacity: 0.8;
    transition: 0.3s ease;
  }
`;

export default Button;
