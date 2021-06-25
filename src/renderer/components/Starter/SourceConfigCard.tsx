import path from "path";
import React from "react";
import styled from "styled-components";

import { TypeSourceDescription } from "types/source-config";

// components
import { Card } from "antd";
import { useImageUrl } from "@/hooks";

type TypeProps = {
  hoverable?: boolean;
  config: TypeSourceDescription;
};

// 配置卡片
const SourceConfigCard: React.FC<TypeProps> = props => {
  const getImageURL = useImageUrl();
  const { config } = props;
  const imgUrl = getImageURL(path.join(config.root, config.preview));
  return (
    <StyleSourceConfigCard data-hoverable={props.hoverable}>
      <Card
        hoverable={props.hoverable}
        style={{ width: "100%" }}
        cover={<img alt={config.name} src={imgUrl} />}
      >
        <Card.Meta title={config.name} description={config.uiVersion.name} />
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
