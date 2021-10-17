import React from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import { useCurrentResModule } from "@/hooks/resource/index";
import { useEditorSelector } from "@/store";
import { StaticResourceImage } from "../ImageCollection";

// 模块选择器
const ModuleSelector: React.FC<{ className?: string }> = props => {
  const resourceModuleList = useEditorSelector(
    state => state.resourceConfig.moduleList
  );
  const [currentModule, setCurrentModule] = useCurrentResModule();

  if (resourceModuleList.length === 0) return null;
  if (!currentModule) return null;

  return (
    <div className={props.className}>
      {resourceModuleList.map((item, key) => (
        <Tooltip key={key} title={item.name} placement="right">
          <StyleIcon onClick={() => setCurrentModule(item)}>
            {/* <img
              className="icon"
              data-isActive={String(currentModule.index === item.index)}
              alt=""
              src={getImageURL(item.icon)}
            /> */}
            <StaticResourceImage
              className="icon"
              data-active={String(currentModule.index === item.index)}
              src={item.icon}
            />
          </StyleIcon>
        </Tooltip>
      ))}
    </div>
  );
};

const StyleIcon = styled.div`
  width: 80px;
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
