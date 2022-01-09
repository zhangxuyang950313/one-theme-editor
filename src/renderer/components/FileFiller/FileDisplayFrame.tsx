import React, { ReactNode, useRef } from "react";
import { useHover, useUpdateEffect } from "ahooks";
import styled from "styled-components";

// 文件展示结构
const FileDisplayFrame: React.FC<{
  floatNode: ReactNode;
  primaryNode: ReactNode;
  isFocus?: boolean;
}> = props => {
  const primaryRef = useRef<HTMLDivElement>(null);

  useUpdateEffect(() => {
    if (!props.isFocus) return;
    primaryRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth"
    });
  }, [props.isFocus]);

  const isHovering = useHover(primaryRef);

  return (
    <StyleFileDisplay>
      {/* 主要展示区域 */}
      <div ref={primaryRef} className="primary-display" data-is-focus={props.isFocus}>
        {props.primaryNode}
      </div>
      {/* 左上角悬浮展示 */}
      <div className="float-display" data-primary-hovering={isHovering}>
        {props.floatNode}
      </div>
    </StyleFileDisplay>
  );
};

const StyleFileDisplay = styled.div`
  display: flex;
  position: relative;
  width: 100px;
  .float-display {
    position: absolute;
    left: -5px;
    top: -5px;
    width: 30px;
    height: 30px;
    overflow: hidden;
    border-radius: 5px;
    border: 1px solid var(--color-primary-light-4);
    transition: 0.2s all ease-in;
    &[data-primary-hovering="true"] {
      opacity: 0;
      transition: 0.2s all ease-out;
    }
  }
  .primary-display {
    cursor: pointer;
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid var(--color-border-2);
    transition: 0.2s all ease-in;
    &[data-is-focus="true"] {
      background-color: var(--color-primary-light-1);
      filter: drop-shadow(0 0 5px var(--color-primary-light-4));
      border: 1px solid rgb(var(--primary-6));
      transition: 0.2s all ease-out;
    }
  }
`;
export default FileDisplayFrame;
