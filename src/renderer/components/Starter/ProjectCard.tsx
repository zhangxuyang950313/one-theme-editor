import React from "react";
import styled from "styled-components";

import { Card } from "antd";

import { TypeProjectDescription } from "src/types/project";

type TypeProps = {
  hoverable?: boolean;
  description: TypeProjectDescription;
  onClick?: (data: TypeProjectDescription) => void;
};
// 工程卡片展示
function ProjectCard(props: TypeProps): JSX.Element {
  const { description } = props;
  return (
    <StyleProjectCard
      data-hoverable={props.hoverable}
      onClick={() => props.onClick && props.onClick(description)}
    >
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
          title={description.name}
          description={description.uiVersion}
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
