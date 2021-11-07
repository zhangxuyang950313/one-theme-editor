/**
 * 单个选项 tab
 */
import React from "react";
import styled from "styled-components";

type TypeSingleTabProps = {
  children: string;
  isActive: boolean;
  onClick: () => void;
};
export default function BaseSingleTab(props: TypeSingleTabProps): JSX.Element {
  return (
    <StyleBaseSingleTab>
      <div
        className="tab-wrapper"
        onClick={props.onClick}
        is-active={String(props.isActive)}
      >
        <span className="name">{props.children}</span>
      </div>
    </StyleBaseSingleTab>
  );
}

const StyleBaseSingleTab = styled.div`
  flex-shrink: 0;
  .tab-wrapper {
    position: relative;
    cursor: pointer;
    margin: 10px;
    text-align: center;
    transition: all 1s;
    .name {
      font-size: 14px;
      line-height: 30px;
    }
    &[is-active="true"] {
      color: rgba(var(--primary-6));
    }
    &[is-active="false"] {
      color: var(--color-border);
    }
    &[is-active="true"]::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 50%;
      height: 2px;
      background-color: rgba(var(--primary-6));
      transition: all 1s;
    }
  }
`;
