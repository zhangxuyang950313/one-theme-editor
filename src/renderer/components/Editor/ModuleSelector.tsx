import React from "react";
import styled from "styled-components";
import logSymbols from "log-symbols";
import { Tooltip } from "antd";
import { useSourceModuleList, useSourceModuleConf } from "@/hooks/source";
import { SourceImage } from "../ImageCollection";

// 模块选择器
const ModuleSelector: React.FC = () => {
  const sourceModuleList = useSourceModuleList();
  const [currentModule, setCurrentModule] = useSourceModuleConf();

  if (!currentModule) return null;

  if (sourceModuleList.length === 0) {
    console.log(logSymbols.error, "modules 为空");
    return null;
  }

  return (
    <>
      {sourceModuleList.map((item, key) => (
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
    </>
  );
};

const StyleIcon = styled.div`
  width: 100%;
  height: 70px;
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
  }
  .name {
    font-size: 12px;
    text-align: center;
  }
`;

export default ModuleSelector;
