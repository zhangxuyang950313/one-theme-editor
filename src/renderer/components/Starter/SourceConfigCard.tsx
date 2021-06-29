import path from "path";
import React from "react";
import styled from "styled-components";

import { TypeSourceDescription } from "types/source-config";

// components
import { Card } from "antd";
import { usePathConfig } from "hooks/index";
import { useImageUrl } from "hooks/image";

type TypeProps = {
  hoverable?: boolean;
  sourceDescription: TypeSourceDescription;
};

// 配置卡片
const SourceConfigCard: React.FC<TypeProps> = props => {
  const { sourceDescription } = props;
  const pathConfig = usePathConfig();
  const imageFilepath = path.join(
    pathConfig?.SOURCE_CONFIG_DIR || "",
    sourceDescription.namespace,
    sourceDescription.preview
  );
  const [imgUrl] = useImageUrl(imageFilepath);
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
