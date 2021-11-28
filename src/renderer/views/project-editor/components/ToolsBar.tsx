/**
 * 工具栏
 */
import React from "react";
import styled from "styled-components";
import { TOOLS_BAR_BUTTON } from "src/common/enums";

import {
  IconExport,
  IconEye,
  IconEyeInvisible,
  IconFile,
  IconInfoCircle,
  IconMindMapping,
  IconMobile
} from "@arco-design/web-react/icon";

import { useRecoilState } from "recoil";

import { panelToggleState } from "../store/rescoil/state";

import IconButton from "@/components/one-ui/IconButton";

const ToolsBar: React.FC = props => {
  const [panelToggle, setPanelToggle] = useRecoilState(panelToggleState);

  const toggleModuleSelector = () => {
    setPanelToggle(state => ({
      ...state,
      moduleSelector: !state.moduleSelector
    }));
  };

  const togglePageSelector = () => {
    setPanelToggle(state => ({
      ...state,
      pageSelector: !state.pageSelector
    }));
  };
  const togglePagePreview = () => {
    setPanelToggle(state => ({
      ...state,
      pagePreview: !state.pagePreview
    }));
  };

  return (
    <StyleToolsBar>
      <div className="btn-group left">
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.MODULE_TOGGLE}
          icon={<IconMindMapping />}
          toggle={panelToggle.moduleSelector}
          onClick={toggleModuleSelector}
        />
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.PAGE_TOGGLE}
          icon={<IconFile />}
          toggle={panelToggle.pageSelector}
          onClick={togglePageSelector}
        />
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.PREVIEW_TOGGLE}
          icon={panelToggle.pagePreview ? <IconEye /> : <IconEyeInvisible />}
          toggle={panelToggle.pagePreview}
          onClick={togglePagePreview}
        />
      </div>
      <div className="btn-group right">
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.APPLY}
          icon={<IconMobile />}
          onClick={toggleModuleSelector}
        />
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.EXPORT}
          icon={<IconExport />}
          onClick={toggleModuleSelector}
        />
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.INFO}
          icon={<IconInfoCircle />}
          onClick={toggleModuleSelector}
        />
      </div>
    </StyleToolsBar>
  );
};

const StyleToolsBar = styled.div`
  width: 100%;
  padding: 15px 10px 10px 10px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  box-sizing: border-box;
  -webkit-app-region: drag;
  .btn-group {
    width: 100%;
    display: flex;
    &.left {
      display: flex;
    }
    &.right {
      display: flex;
      justify-content: flex-end;
    }
    .item {
      -webkit-app-region: none;
      width: 50px;
      margin: 0 10px;
    }
  }
`;
export default ToolsBar;
