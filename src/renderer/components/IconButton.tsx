/**
 * 基础组件
 * 图标按钮，使用 antd—icons
 */
import React from "react";
import styled from "styled-components";

export default function IconButton(props: {
  text: string;
  children: JSX.Element;
  onClick?: () => void;
}): JSX.Element {
  const handleClick = () => {
    if (typeof props.onClick === "function") {
      props.onClick();
    }
  };
  return (
    <StyleIconButton>
      <div className="icon-btn-wrapper" onClick={handleClick}>
        <div className="icon-btn">{props.children}</div>
        <span className="btn-name">{props.text}</span>
      </div>
    </StyleIconButton>
  );
}

const StyleIconButton = styled.div`
  .icon-btn-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
      .icon-btn {
        background: ${({ theme }) => theme["@text-color-secondary"]};
      }
    }
    .icon-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 3px;
      width: 40px;
      height: 22px;
      background: ${({ theme }) => theme["@disabled-color"]};
      color: ${({ theme }) => theme["@text-color-secondary"]};
    }
    .btn-name {
      color: ${({ theme }) => theme["@text-color-secondary"]};
      margin-top: 3px;
      font-size: 11px;
    }
  }
`;
