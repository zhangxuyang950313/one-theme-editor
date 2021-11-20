/**
 * 基础组件
 * 图标按钮，使用 antd—icons
 */
import React from "react";
import { TOOLS_BAR_BUTTON } from "src/common/enums";
import styled from "styled-components";

export type TypeIconButtonOption = {
  name: TOOLS_BAR_BUTTON;
  icon: JSX.Element;
  toggle?: boolean;
  onClick?: (toggle: boolean) => void;
};
export default function IconButton(
  props: React.PropsWithChildren<TypeIconButtonOption & { className?: string }>
): JSX.Element {
  const { name, icon, toggle, onClick, className } = props;
  return (
    <StyleIconButton className={className}>
      <div
        className="icon-btn"
        data-toggle={Boolean(toggle)}
        onClick={() => {
          onClick?.(!toggle);
        }}
      >
        {icon}
      </div>
      {name && <span className="btn-name">{name}</span>}
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
    font-size: 16px;
    background-color: var(--color-secondary);
    color: var(--color-text-2);
    transition: 0.3s ease-out;
    &[data-toggle="true"] {
      background-color: rgba(var(--primary-6));
      color: var(--color-bg-4);
      transform: 0.3s ease-in;
    }
    &:hover {
      color: var(--color-text-2);
      background-color: var(--color-secondary-hover);
    }
    &:active {
      background-color: var(--color-secondary-active);
    }
  }
  .btn-name {
    color: var(--color-text-2);
    margin-top: 3px;
    font-size: 11px;
  }
`;
