/**
 * 工具栏
 */
import React, { useRef } from "react";
import styled from "styled-components";

import { TOOLS_BAR_BUTTON } from "src/common/enums";
import IconButton, {
  TypeIconButtonOption
} from "@/components/one-ui/IconButton";

const ButtonGroup: React.FC<{ buttonList: TypeIconButtonOption[] }> = props => {
  return (
    <StyleButtonGroup>
      {props.buttonList.map((button, key) => (
        <div className="item" key={key}>
          {button.name !== TOOLS_BAR_BUTTON.PLACEHOLDER && (
            <IconButton {...button}>{button.icon}</IconButton>
          )}
        </div>
      ))}
    </StyleButtonGroup>
  );
};

const StyleButtonGroup = styled.div`
  display: flex;
  .item {
    -webkit-app-region: none;
    width: 50px;
    margin: 0 10px;
  }
`;

const ToolsBar: React.FC<{
  className?: string;
  buttonsGroupList: Array<TypeIconButtonOption[]>;
}> = props => {
  const thisRef = useRef<HTMLDivElement | null>();

  return (
    <StyleToolsBar ref={r => (thisRef.current = r)} className={props.className}>
      <div className="btn-group">
        {props.buttonsGroupList.map((buttonList, key) => {
          return <ButtonGroup key={key} buttonList={buttonList} />;
        })}
      </div>
    </StyleToolsBar>
  );
};

const StyleToolsBar = styled.div`
  width: 100%;
  padding: 15px 10px 10px 10px;
  display: flex;
  flex-shrink: 0;
  box-sizing: border-box;
  -webkit-app-region: drag;
  .btn-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;
export default ToolsBar;
