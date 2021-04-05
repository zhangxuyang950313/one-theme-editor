import { TypeProjectInfo } from "@/core/data";
import React from "react";
import styled from "styled-components";

import { Card } from "antd";

type TypeProps = {
  hoverable?: boolean;
  projectInfo: TypeProjectInfo;
};
// 工程卡片展示
function ProjectCard(props: TypeProps): JSX.Element {
  const { projectInfo } = props;
  return (
    <StyleProjectCard data-hoverable={props.hoverable}>
      <Card
        hoverable={props.hoverable}
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
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .ant-card-body {
    padding: 16px;
  }
  &:hover[data-hoverable] {
    transform: translateY(-5px);
  }
  transition: 0.3s all ease-in;
`;

export default ProjectCard;
