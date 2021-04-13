import React from "react";
import styled from "styled-components";

import { TypeTemplateConf } from "@/types/project";

// components
import { CheckCircleTwoTone } from "@ant-design/icons";
import { Empty } from "antd";
import TemplateCard from "./TemplateCard"; // 模板卡片单项

type TypeProps = {
  templateList: TypeTemplateConf[];
  selective?: TypeTemplateConf;
  onSelected: (config?: TypeTemplateConf) => void;
};

// 模板卡片管理
function TemplateManager(props: TypeProps): JSX.Element {
  const { templateList, selective, onSelected } = props;
  return (
    <StyleTemplateManager>
      {templateList.length === 0 ? (
        <Empty
          className="empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`暂无模板`}
        />
      ) : (
        templateList.map((template, key) => {
          const isActive = selective?.key === template.key;
          const isInit = !selective?.key;
          return (
            <StyleCardContainer
              isInit={isInit}
              isActive={isActive}
              onClick={() => {
                // 点选中的恢复初始状态
                onSelected(isActive ? undefined : template);
              }}
              key={key}
            >
              <TemplateCard hoverable config={template} />
              <CheckCircleTwoTone className="check-icon" />
            </StyleCardContainer>
          );
        })
      )}
    </StyleTemplateManager>
  );
}

const StyleTemplateManager = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 50vh;
  overflow-y: auto;
  .empty {
    margin: auto;
  }
`;

type TypeCardContainerProps = { isActive: boolean; isInit: boolean };
const StyleCardContainer = styled.div<TypeCardContainerProps>`
  width: 130px;
  height: 213px;
  margin: 10px;
  opacity: ${({ isInit, isActive }) => 0.5 + 0.5 * Number(isInit || isActive)};
  transition: 0.3s opacity ease-in;
  position: relative;
  .check-icon {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 25px;
    opacity: ${({ isActive }) => Number(isActive)};
    transform: ${({ isActive }) => (isActive ? "scale(1)" : "scale(0)")};
    transition: 0.1s all ease;
  }
`;

export default TemplateManager;
