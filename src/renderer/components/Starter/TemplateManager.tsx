import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { TypeTemplateConfig } from "@/types/project";
import { getTemplateConfigList } from "@/core/template-compiler";

// components
import { CheckCircleTwoTone } from "@ant-design/icons";
import TemplateCard from "./TemplateCard"; // 模板卡片单项

type TypeProps = {
  onSelected: (config?: TypeTemplateConfig) => void;
};

// 模板卡片管理
function TemplateManager(props: TypeProps): JSX.Element {
  const [templateList, setTemplateList] = useState<TypeTemplateConfig[]>([]);
  // 当前选中的序号，-1 为都不选中
  const [selectiveIndex, setSelectiveIndex] = useState(-1);

  // 获取模板列表
  useEffect(() => {
    getTemplateConfigList().then(setTemplateList);
  }, []);

  return (
    <StyleTemplateManager>
      {templateList.map((template, key) => {
        const isActive = selectiveIndex === key;
        const isInit = selectiveIndex === -1;
        return (
          <StyleCardContainer
            isInit={isInit}
            isActive={isActive}
            onClick={() => {
              // 点选中的恢复初始状态
              const index = isActive ? -1 : key;
              setSelectiveIndex(index);
              props.onSelected(templateList[index]);
            }}
            key={key}
          >
            <TemplateCard config={template} />
            <CheckCircleTwoTone className="check-icon" />
          </StyleCardContainer>
        );
      })}
    </StyleTemplateManager>
  );
}

const StyleTemplateManager = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 50vh;
  overflow-y: auto;
`;

type TypeCardContainerProps = { isActive: boolean; isInit: boolean };
const StyleCardContainer = styled.div<TypeCardContainerProps>`
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
