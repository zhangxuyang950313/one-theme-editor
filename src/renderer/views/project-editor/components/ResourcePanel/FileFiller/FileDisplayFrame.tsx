import React, { ReactNode } from "react";
import styled from "styled-components";

// 文件展示结构
const FileDisplayFrame: React.FC<{
  floatNode: ReactNode;
  primaryNode: ReactNode;
  isFocus?: boolean;
}> = props => {
  return (
    <StyleFileDisplay>
      {/* 主要展示区域 */}
      <div className="primary-display" data-is-focus={props.isFocus}>
        {props.primaryNode}
      </div>
      {/* 左上角悬浮展示 */}
      <div className="float-display">{props.floatNode}</div>
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
  }
  .primary-display {
    cursor: pointer;
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid var(--color-border-2);
    &[data-is-focus="true"] {
      border: 1px solid rgb(var(--primary-6));
    }
  }
`;
export default FileDisplayFrame;
