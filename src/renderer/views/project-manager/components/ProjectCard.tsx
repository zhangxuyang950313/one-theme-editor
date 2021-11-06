import React from "react";
import styled from "styled-components";

import { TypeProjectDataDoc, TypeProjectInfo } from "src/types/project";
import ImgDefault from "@/assets/img-default.png";
import { LazyImage } from "@/components/ImageCollection";

type TypeProps = {
  hoverable?: boolean;
  data: TypeProjectDataDoc;
  onClick?: (data: TypeProjectInfo) => void;
};
// 工程卡片展示
function ProjectCard(props: TypeProps): JSX.Element {
  const projectData = props.data;
  const projectInfo = projectData.description;
  return (
    <StyleProjectCard
      data-hoverable={props.hoverable}
      onClick={() => props.onClick && props.onClick(projectInfo)}
    >
      <LazyImage className="preview" src={ImgDefault} />
      {<div className="name">{projectInfo.name || "未命名"}</div>}
    </StyleProjectCard>
  );
}

const StyleProjectCard = styled.div`
  cursor: pointer;
  position: relative;
  width: 140px;
  height: 240px;
  border: 1px solid;
  border-color: ${({ theme }) => theme["@border-color-base"]};
  border-radius: ${({ theme }) => theme["@border-radius-base"]};
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
    padding: 10px;
    color: var(--color-text-1);
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: var(--color-border-4);
  }
  &:hover[data-hoverable] {
    transform: translateY(-5px);
    transition: 0.3s all ease-out;
    box-shadow: 5px;
  }
  transition: 0.3s all ease-in;
`;

export default ProjectCard;
