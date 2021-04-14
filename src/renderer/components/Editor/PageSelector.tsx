import React from "react";
import styled from "styled-components";

import { Collapse } from "antd";
import { TypeTempPreviewClassConf } from "@/types/project";

// 页面选择器
type TypeProps = {
  tempClasses: TypeTempPreviewClassConf[];
};
const PageSelector: React.FC<TypeProps> = props => {
  const { tempClasses } = props;
  return (
    <StylePageSelector>
      <Collapse
        bordered={false}
        defaultActiveKey={Object.keys(tempClasses).map(o => Number(o))}
      >
        {tempClasses.map((item, key) => {
          return <Collapse.Panel header={item.name} key={key}></Collapse.Panel>;
        })}
      </Collapse>
    </StylePageSelector>
  );
};

const StylePageSelector = styled.div`
  width: 360px;
`;

export default PageSelector;
