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
  background: ${({ type }) => (type === "primary" ? "rgb(var(--primary-6))" : "var(--color-text-1)")};
  border: transparent;
  border-radius: 6px;
  outline: none;
  transition: 0.3s ease;
  color: ${({ type, theme }) => (type === "primary" ? "black" : "var(--color-text-1)")};
  &:hover {
    opacity: 0.8;
    transition: 0.3s ease;
  }
`;

export default Button;
