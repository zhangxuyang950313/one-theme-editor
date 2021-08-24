import React from "react";
import styled from "styled-components";

import { TypeSourceConfigInfo } from "types/source";

// components
import { Card } from "antd";
import { useSourceImageUrl } from "@/hooks/source";

type TypeProps = {
  hoverable?: boolean;
  sourceDescription: TypeSourceConfigInfo;
};

// 配置卡片
const SourceConfigCard: React.FC<TypeProps> = props => {
  const { sourceDescription } = props;
  const imgUrl = useSourceImageUrl(sourceDescription.preview);
  return (
    <StyleSourceConfigCard data-hoverable={props.hoverable}>
      <Card
        hoverable={props.hoverable}
        style={{ width: "100%" }}
        cover={<img alt={sourceDescription.name} src={imgUrl} />}
      >
        <Card.Meta
          title={sourceDescription.name}
          description={sourceDescription.uiVersion.name}
        />
      </Card>
    </StyleSourceConfigCard>
  );
};

const StyleSourceConfigCard = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .ant-card {
    box-sizing: border-box;
  }
  .ant-card-body {
    padding: 10px;
    font-size: 10px;
    .ant-card-meta-title {
      font-size: 12px;
    }
  }
  &:hover[data-hoverable="true"] {
    transform: translateY(-2px);
  }
  transition: 0.3s all ease-in;
`;

export default SourceConfigCard;
