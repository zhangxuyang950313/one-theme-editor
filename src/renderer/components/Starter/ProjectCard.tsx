import { TypeProjectInfo } from "@/core/data";
import React from "react";
import styled from "styled-components";

// 工程卡片展示
function ProjectCard(props: { projectInfo: TypeProjectInfo }): JSX.Element {
  return (
    <StyleProjectCard>
      <p>{props.projectInfo.name}</p>
      <p>{props.projectInfo._id}</p>
    </StyleProjectCard>
  );
}

const StyleProjectCard = styled.div`
  cursor: pointer;
  width: 150px;
  height: 267px;
  margin: 0 20px 20px 0;
  border: 1px solid;
  border-radius: 10px;
  border-color: ${({ theme }) => theme["@border-color-base"]};

  &:hover {
    transform: translateY(-10px);
  }
  transition: 0.2s all ease-in-out;
`;

export default ProjectCard;
