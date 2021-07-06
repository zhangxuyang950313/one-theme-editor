import React from "react";
import styled from "styled-components";
import logSymbols from "log-symbols";

import { useModuleList, useModuleConf } from "@/hooks/source";

import { Tooltip } from "antd";
// import { useGetSourceImageUrl } from "@/hooks/image";
import SourceImage from "../Image/SourceImage";

// 模块选择器
const ModuleSelector: React.FC = () => {
  const moduleList = useModuleList();
  const [currentModule, setCurrentModule] = useModuleConf();
  // const getImageURL = useGetSourceImageUrl();

  if (!currentModule) {
    console.log(logSymbols.error, "currentModule 为空");
    return null;
  }

  if (moduleList.length === 0) {
    console.log(logSymbols.error, "modules 为空");
    return null;
  }

  return (
    <StyleModuleSelector>
      {moduleList.map((item, key) => (
        <Tooltip key={key} title={item.name} placement="right">
          <StyleIcon onClick={() => setCurrentModule(item)}>
            {/* <img
              className="icon"
              data-isActive={String(currentModule.index === item.index)}
              alt=""
              src={getImageURL(item.icon)}
            /> */}
            <SourceImage
              className="icon"
              data-active={String(currentModule.index === item.index)}
              src={item.icon}
            />
          </StyleIcon>
        </Tooltip>
      ))}
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
const StyleIcon = styled.div`
  width: 100%;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    cursor: pointer;
    width: 45px;
    opacity: 0.4;
    transition: 0.4s all ease;
    &[data-active="true"] {
      width: 55px;
      opacity: 1;
    }
    /* &:hover {
      width: 50px;
    } */
  }
  .name {
    font-size: 12px;
    text-align: center;
  }
`;

export default ModuleSelector;
