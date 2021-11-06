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
          if ("defaultToggle" in props) setToggle(!toggle);
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
    background: var(--color-secondary);
    color: var(--color-text-2);
    transition: 0.3s ease-out;
    &[data-toggle="true"] {
      background: rgba(var(--primary-6));
      color: var(--color-bg-4);
      transform: 0.3s ease-in;
    }
    &:hover {
      background: var(--color-secondary-hover);
    }
    &:active {
      background: var(--color-secondary-active);
    }
  }
  .btn-name {
    color: var(--color-text-2);
    margin-top: 3px;
    font-size: 11px;
  }
`;
