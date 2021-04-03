import React from "react";
import styled from "styled-components";

import { TypeTemplateConfig } from "@/types/project";

// components
import { Card } from "antd";

type TypeProps = {
  config: TypeTemplateConfig;
};

// 模板卡片样式
function TemplateCard(props: TypeProps): JSX.Element {
  const { config } = props;
  return (
    <StyleTemplateCard>
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
          title={config.name}
          description={config.uiVersions?.map(o => o.name).join(" | ")}
        />
      </Card>
    </StyleTemplateCard>
  );
}

const StyleTemplateCard = styled.div`
  width: 130px;
  height: 213px;
  margin: 10px;
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
  &:hover {
    transform: translateY(-2px);
  }
  transition: 0.3s all ease-in;
`;

export default TemplateCard;
