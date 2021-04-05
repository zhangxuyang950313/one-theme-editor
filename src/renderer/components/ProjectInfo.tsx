import { Form } from "antd";
import React from "react";
import styled from "styled-components";

import { TypeUiVersion } from "@/types/project";
import * as ProjectForm from "./Forms";

type TypeProps = {
  uiVersions: TypeUiVersion[];
};
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 0 }
};
function ProjectInfo(props: TypeProps): JSX.Element {
  return (
    <StyleProjectInfo>
      <Form
        {...layout}
        colon={false}
        labelAlign="right"
        initialValues={{
          version: "1.0.0",
          uiVersion: props.uiVersions[props.uiVersions.length - 1].src
        }}
      >
        <ProjectForm.ProjectName />
        <ProjectForm.ProjectDesigner />
        <ProjectForm.ProjectAuthor />
        <ProjectForm.ProjectVersion />
        <ProjectForm.ProjectUIVersion uiVersions={props.uiVersions} />
      </Form>
    </StyleProjectInfo>
  );
}

const StyleProjectInfo = styled.div`
  width: 100%;
  .input {
    /* width: 400px; */
  }
`;

export default ProjectInfo;
