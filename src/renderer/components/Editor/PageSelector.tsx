import React from "react";
import styled from "styled-components";

import { useSelectedModule } from "@/hooks/template";

import { Collapse } from "antd";

// 页面选择器
const PageSelector: React.FC = () => {
  const [selectedModule] = useSelectedModule();
  const pageGroups = selectedModule?.groups;
  if (!pageGroups) {
    console.log("页面分组为空");
    return null;
  }
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
