import path from "path";
import React, { useState } from "react";
import styled from "styled-components";

import { TypeTemplateConfig, TypeTempModule } from "@/types/project";

import AsyncImage from "@/components/AsyncImage";

type TypeProps = {
  templateConfig: TypeTemplateConfig;
  onSelected: (x: TypeTempModule) => void;
};
// 模块选择器
const ModuleSelector: React.FC<TypeProps> = props => {
  const { templateConfig, onSelected } = props;
  const [selectedIndex, updateIndex] = useState(0);
  if (!templateConfig) return null;
  const { root, modules } = templateConfig;
  if (!modules) return null;

  return (
    <StyleModuleSelector>
      {modules.map((item, key) => {
        if (!item?.icon) return null;
        return (
          <StyleIcon
            key={key}
            isActive={selectedIndex === key}
            onClick={() => {
              updateIndex(key);
              onSelected(item);
            }}
          >
            <AsyncImage src={path.resolve(root, item.icon)} alt="" />
          </StyleIcon>
        );
      })}
    </StyleModuleSelector>
  );
};

const StyleModuleSelector = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 100vh;
  overflow-y: auto;
  border-right: ${({ theme }) => theme["@border-color-base"]} 1px solid;
  padding: 80px 0;
`;
type TypeStyleIconProps = { isActive: boolean };
const StyleIcon = styled.div<TypeStyleIconProps>`
  width: ${({ isActive }) => (isActive ? "55px" : "45px")};
  opacity: ${({ isActive }) => (isActive ? 1 : 0.4)};
  margin: 20px auto;
  cursor: pointer;
  &:hover {
    width: 60px;
  }
  transition: 0.4s all ease;
`;

export default ModuleSelector;
