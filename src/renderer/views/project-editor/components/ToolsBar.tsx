/**
 * 工具栏
 */
import path from "path";

import React, { useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { useToggle } from "ahooks";
import {
  IconExport,
  IconEye,
  IconEyeInvisible,
  IconFile,
  IconInfoCircle,
  IconMindMapping,
  IconMobile
} from "@arco-design/web-react/icon";
import { dialog } from "@electron/remote";
import { TOOLS_BAR_BUTTON } from "src/common/enums";

import { panelToggleState, projectDataState } from "../store/rescoil/state";
import useApplyProject from "../hooks/useApplyProject";
import useExportProject from "../hooks/useExportProject";

import ProjectInfoDrawer from "./ProjectInfoDrawer";

import IconButton from "@/components/one-ui/IconButton";

const ToolsBar: React.FC = () => {
  const [panelToggle, setPanelToggle] = useRecoilState(panelToggleState);
  const [modifyInfoVisible, modifyInfoToggle] = useToggle(false);
  const { projectData, scenarioConfig } = useRecoilValue(projectDataState);
  const toolsBarRef = useRef<HTMLDivElement>(null);
  const handleExport = useExportProject();
  const handleApply = useApplyProject(progress => {
    console.log("应用进度", { progress });
  });

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
    <StyleToolsBar ref={toolsBarRef}>
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
          onClick={async () => {
            // 先打包后应用
            // const filepath = await handleExport();
            // console.log(filepath);
            const filepath = "/Users/zhangxuyang/Desktop/测试text.mtz";
            handleApply({
              deviceId: "e77d6aba",
              packagedFile: filepath
            });
          }}
        />
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.EXPORT}
          icon={<IconExport />}
          onClick={() => {
            const filename = `${projectData.description.name}.${scenarioConfig.packageConfig.extname}`;
            // TODO：用主进程调
            const filepath = dialog.showSaveDialogSync({
              title: "导出",
              defaultPath: path.join(path.dirname(projectData.root), filename)
            });
            if (!filepath) return;
            handleExport(filepath);
          }}
        />
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.INFO}
          icon={<IconInfoCircle />}
          onClick={modifyInfoToggle.toggle}
        />
      </div>
      <ProjectInfoDrawer
        drawerProps={{
          wrapClassName: "drawer",
          width: 500,
          visible: modifyInfoVisible,
          onCancel: modifyInfoToggle.setLeft
        }}
      />
    </StyleToolsBar>
  );
};

const StyleToolsBar = styled.div`
  position: relative;
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

  .drawer {
    margin-top: 30px;
    height: calc(100% - 60px);
  }
`;
export default ToolsBar;
