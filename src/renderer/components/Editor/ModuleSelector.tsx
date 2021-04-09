import path from "path";
import React from "react";
import styled from "styled-components";

import { TypeTemplateConfig } from "@/types/project";
import { getImageByPath } from "@/core/data";

import AsyncImage from "@/components/AsyncImage";

type TypeProps = {
  templateConfig: TypeTemplateConfig;
};
// 模块选择器
const ModuleSelector: React.FC<TypeProps> = props => {
  const { templateConfig } = props;
  if (!templateConfig) return null;
  console.log(templateConfig);
  const { root, modules } = templateConfig;
  if (!modules) return null;

  return (
    <StyleModuleSelector>
      {modules.map((item, key) => {
        if (!item?.icon) return null;
        return (
          <StyleIcon key={key}>
            <AsyncImage src={path.resolve(root, item.icon)} alt="" />
          </StyleIcon>
        );
      })}
    </StyleModuleSelector>
  );
};

const StyleModuleSelector = styled.div`
  width: 90px;
  height: 100vh;
  overflow-y: auto;
  border-right: ${({ theme }) => theme["@border-color-base"]} 1px solid;
  padding: 80px 0;
`;
const StyleIcon = styled.div`
  width: 50px;
  margin: 20px auto;
  cursor: pointer;
  &:hover {
    width: 60px;
  }
  transition: 0.4s all ease;
`;

export default ModuleSelector;
