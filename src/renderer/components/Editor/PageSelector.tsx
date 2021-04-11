import path from "path";
import React from "react";
import styled from "styled-components";

import { Collapse } from "antd";
import { TypeTempPreviewClass } from "@/types/project";
import AsyncImage from "../AsyncImage";

// 页面选择器
type TypeProps = {
  tempClasses: TypeTempPreviewClass[];
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
          return (
            <Collapse.Panel header={item.name} key={key}>
              {/* <AsyncImage src=""/> */}
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </StylePageSelector>
  );
};

const StylePageSelector = styled.div`
  width: 360px;
`;

export default PageSelector;
