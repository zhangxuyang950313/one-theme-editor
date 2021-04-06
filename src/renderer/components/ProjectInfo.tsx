import React from "react";
import styled from "styled-components";

import { TypeProjectInfo } from "@/types/project";

import ProjectCard from "./Starter/ProjectCard";

type TypeProps = {
  projectInfo: TypeProjectInfo;
};
function ProjectInfo(props: TypeProps): JSX.Element {
  const { projectInfo } = props;
  return (
    <StyleProjectInfo>
      <ProjectCard projectInfo={projectInfo}></ProjectCard>
    </StyleProjectInfo>
  );
}

const StyleProjectInfo = styled.div``;

export default ProjectInfo;
