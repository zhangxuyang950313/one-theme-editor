import { Form, Input } from "antd";
import React from "react";
import styled from "styled-components";

const ProjectInfo: React.FC = () => {
  return (
    <StyleProjectInfo>
      <Form>
        <Form.Item name="projectName" label="主题名称">
          <Input />
        </Form.Item>
      </Form>
    </StyleProjectInfo>
  );
};

const StyleProjectInfo = styled.div``;

export default ProjectInfo;
