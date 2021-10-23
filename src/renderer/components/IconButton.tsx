/**
 * 基础组件
 * 图标按钮，使用 antd—icons
 */
import React, { useState } from "react";
import { TOOLS_BAR_BUTTON } from "src/enum";
import styled from "styled-components";

export type TypeIconButtonOption = {
  name: TOOLS_BAR_BUTTON;
  icon: JSX.Element;
  defaultToggle?: boolean;
  onClick?: (toggle: boolean) => void;
};
export default function IconButton(
  props: React.PropsWithChildren<TypeIconButtonOption & { className?: string }>
): JSX.Element {
  const [toggle, setToggle] = useState(props.defaultToggle);
  return (
    <StyleIconButton className={props.className}>
      <div
        className="icon-btn"
        data-toggle={Boolean(toggle)}
        onClick={() => {
          setToggle(!toggle);
          props?.onClick && props.onClick(!toggle);
        }}
      >
        {props.children}
      </div>
      {props.name && <span className="btn-name">{props.name}</span>}
    </StyleIconButton>
  );
}

const StyleIconButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .icon-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    width: 40px;
    height: 22px;
    background: ${({ theme }) => theme["@border-color-secondary"]};
    color: ${({ theme }) => theme["@text-color-secondary"]};
    transition: 0.3s ease-out;
    &[data-toggle="true"] {
      background: ${({ theme }) => theme["@primary-color"]};
      color: ${({ theme }) => theme["@background-color-thirdly"]};
      transform: 0.3s ease-in;
    }
    &:hover {
      opacity: 0.6;
    }
    &:active {
      opacity: 0.4;
    }
  }
  .btn-name {
    color: ${({ theme }) => theme["@text-color-secondary"]};
    margin-top: 3px;
    font-size: 11px;
  }
`;
