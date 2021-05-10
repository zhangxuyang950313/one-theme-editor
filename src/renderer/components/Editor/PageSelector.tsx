import React from "react";
import styled from "styled-components";

import { Collapse } from "antd";
import { TypeTempPageGroupConf } from "types/project";

// 页面选择器
type TypeProps = {
  pageGroups: TypeTempPageGroupConf[];
};
const PageSelector: React.FC<TypeProps> = props => {
  const { pageGroups } = props;
  return (
    <StylePageSelector>
      <Collapse bordered={false} defaultActiveKey={Object.keys(pageGroups)}>
        {pageGroups.map((group, key) => (
          <Collapse.Panel header={group.name} key={key}>
            <StylePagePreview>
              {group.pages.map((page, index) => (
                <img
                  className="image"
                  key={index}
                  src={page.preview}
                  alt={page.pathname}
                />
              ))}
            </StylePagePreview>
          </Collapse.Panel>
        ))}
      </Collapse>
    </StylePageSelector>
  );
};

const StylePageSelector = styled.div`
  width: 360px;
`;

const StylePagePreview = styled.div`
  display: flex;
  justify-content: space-around;
  .image {
    cursor: pointer;
    width: 40%;
  }
`;

export default PageSelector;
