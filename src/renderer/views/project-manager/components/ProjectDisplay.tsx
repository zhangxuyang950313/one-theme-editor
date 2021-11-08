import React from "react";
import styled from "styled-components";

import { PreloadImage } from "@/components/ImageCollection";

// 工程卡片展示
function ProjectDisplay(props: { image: string; name: string }): JSX.Element {
  return (
    <StyleProjectDisplay>
      <PreloadImage className="preview" src={props.image} />
      {<div className="name">{props.name || "未命名"}</div>}
    </StyleProjectDisplay>
  );
}

const StyleProjectDisplay = styled.div`
  cursor: pointer;
  position: relative;
  width: 120px;
  height: 200px;
  border: 1px solid;
  border-color: var(--color-secondary);
  border-radius: 4px;
  box-sizing: content-box;
  overflow: hidden;
  .preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .name {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 6px;
    color: var(--color-text-1);
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: rgba(var(--gray-2), 0.8);
  }
`;

export default ProjectDisplay;
