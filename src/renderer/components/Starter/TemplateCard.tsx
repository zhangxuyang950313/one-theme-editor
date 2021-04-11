import React from "react";
import styled from "styled-components";

import { TypeTempConf } from "@/types/project";

// components
import { Card } from "antd";

type TypeProps = {
  hoverable?: boolean;
  config: TypeTempConf;
};

// 模板卡片样式
function TemplateCard(props: TypeProps): JSX.Element {
  const { config } = props;
  const cover = (
    <img
      alt="example"
      src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
    />
  );
  return (
    <StyleTemplateCard data-hoverable={props.hoverable}>
      <Card hoverable={props.hoverable} style={{ width: "100%" }} cover={cover}>
        <Card.Meta
          title={config.name}
          description={config.uiVersions?.map(o => o.name).join(" | ")}
        />
      </Card>
    </StyleTemplateCard>
  );
}

const StyleTemplateCard = styled.div`
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

export default TemplateCard;
