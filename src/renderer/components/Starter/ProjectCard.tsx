import React from "react";
import styled from "styled-components";

import { TypeProjectDataDoc, TypeProjectInfo } from "src/types/project";
import { LazyImage } from "../ImageCollection";

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
      <LazyImage
        className="preview"
        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
      />
      <div className="name">{projectInfo.name}</div>
    </StyleProjectCard>
  );
}

const StyleProjectCard = styled.div`
  cursor: pointer;
  width: 160px;
  height: 260px;
  border: 1px solid;
  border-color: ${({ theme }) => theme["@border-color-base"]};
  border-radius: ${({ theme }) => theme["@border-radius-base"]};
  box-sizing: content-box;
  overflow: hidden;
  .preview {
    width: 100%;
    height: 60%;
    object-fit: cover;
  }
  .name {
    height: 40%;
    padding: 10px;
    color: ${({ theme }) => theme["@text-color"]};
    /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
  }
  &:hover[data-hoverable] {
    transform: translateY(-5px);
    box-shadow: 5px;
  }
  transition: 0.3s all ease-in;
`;

export default ProjectCard;
