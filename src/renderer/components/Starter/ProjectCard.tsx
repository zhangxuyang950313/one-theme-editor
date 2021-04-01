import { TypeProjectInfo } from "@/core/data";
import React from "react";
import styled from "styled-components";

import { Card } from "antd";

// 工程卡片展示
function ProjectCard(props: { projectInfo: TypeProjectInfo }): JSX.Element {
  const { projectInfo } = props;
  return (
    <StyleProjectCard>
      <Card
        hoverable
        style={{ width: "100%" }}
        cover={
          <img
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          />
        }
      >
        <Card.Meta
          title={projectInfo.name}
          description={projectInfo.uiVersion}
        />
      </Card>
    </StyleProjectCard>
  );
}

const StyleProjectCard = styled.div`
  cursor: pointer;
  width: 150px;
  height: 267px;
  margin: 0 20px 20px 0;
  box-sizing: border-box;
  .ant-card-body {
    padding: 16px;
  }
  &:hover {
    transform: translateY(-5px);
  }
  transition: 0.3s all ease-in;
`;

export default ProjectCard;
