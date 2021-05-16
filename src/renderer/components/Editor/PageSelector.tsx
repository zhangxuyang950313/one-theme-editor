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
    <Collapse bordered={false} defaultActiveKey={Object.keys(pageGroups)}>
      {pageGroups.map((group, key) => (
        <Collapse.Panel header={group.name} key={key}>
          <StylePagePreview>
            {group.pages.map((page, index) => (
              <StyleImage key={index} alt={page.pathname} src={page.preview} />
            ))}
          </StylePagePreview>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

const StyleImage = styled.img`
  cursor: pointer;
  width: 48%;
  border-radius: 10px;
`;

const StylePagePreview = styled.div`
  display: flex;
  justify-content: space-around;
  overflow: hidden;
`;

export default PageSelector;
