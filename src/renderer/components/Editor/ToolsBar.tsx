/**
 * 工具栏
 */
import path from "path";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import {
  ExportOutlined,
  InfoCircleOutlined,
  MobileOutlined,
  FolderOutlined
} from "@ant-design/icons";
import IconButton from "@/components/IconButton";
import usePackProject from "@/hooks/project/usePackProject";
import { remote } from "electron";
import { message, notification } from "antd";
import { TOOLS_BAR_BUTTON } from "src/enum";
import { useEditorSelector } from "@/store";
import ProjectInfoModal from "./ProjectInfoModal";

const buttons = [
  // { name: TOOLS_BAR_BUTTON.CREATE, icon: <PlusOutlined /> },
  // { name: TOOLS_BAR_BUTTON.OPEN, icon: <FolderOpenOutlined /> },
  // { name: TOOLS_BAR_BUTTON.PLACEHOLDER, icon: <div /> },
  // { name: TOOLS_BAR_BUTTON.PLACEHOLDER, icon: <div /> },
  { name: TOOLS_BAR_BUTTON.APPLY, icon: <MobileOutlined /> },
  { name: TOOLS_BAR_BUTTON.SAVE, icon: <FolderOutlined /> },
  { name: TOOLS_BAR_BUTTON.EXPORT, icon: <ExportOutlined /> },
  // { name: TOOLS_BAR_BUTTON.PLACEHOLDER, icon: <div /> },
  { name: TOOLS_BAR_BUTTON.INFO, icon: <InfoCircleOutlined /> }
  // { name: TOOLS_BAR_BUTTON.DARK, icon: <InfoCircleOutlined /> },
  // { name: TOOLS_BAR_BUTTON.LIGHT, icon: <InfoCircleOutlined /> }
];

const ToolsBar: React.FC = () => {
  const thisRef = useRef<HTMLDivElement | null>();
  const [projectInfoVisible, setProjectInfoVisible] = useState(false);
  const projectData = useEditorSelector(state => state.projectData);
  const packageConfig = useEditorSelector(
    state => state.scenarioConfig.packageConfig
  );
  const packProject = usePackProject();
  const handleClick = (name: TOOLS_BAR_BUTTON) => {
    switch (name) {
      case TOOLS_BAR_BUTTON.APPLY: {
        break;
      }
      case TOOLS_BAR_BUTTON.SAVE: {
        break;
      }
      case TOOLS_BAR_BUTTON.CREATE: {
        remote.getCurrentWindow().close();
        break;
      }
      case TOOLS_BAR_BUTTON.EXPORT: {
        const {
          root,
          description,
          scenarioSrc: scenarioConfigPath
        } = projectData;
        const { extname } = packageConfig;
        const defaultPath = path.join(
          path.dirname(projectData.root),
          `${description.name}.${extname}`
        );
        remote.dialog
          // https://www.electronjs.org/docs/api/dialog#dialogshowopendialogsyncbrowserwindow-options
          .showSaveDialog({
            properties: ["createDirectory"],
            defaultPath,
            filters: [{ name: extname, extensions: [extname] }]
          })
          .then(result => {
            if (result.canceled) return;
            if (!result.filePath) {
              message.info("未指定任何文件");
              return;
            }
            packProject(
              {
                scenarioSrc: scenarioConfigPath,
                packDir: root,
                outputFile: result.filePath
              },
              data => {
                notification.info({
                  message: data.msg,
                  description: data.data
                });
              }
            );
          });
        break;
      }
      case TOOLS_BAR_BUTTON.INFO: {
        setProjectInfoVisible(true);
        break;
      }
      case TOOLS_BAR_BUTTON.DARK: {
        break;
      }
      case TOOLS_BAR_BUTTON.LIGHT: {
        break;
      }
    }
  };
  return (
    <StyleToolsBar ref={r => (thisRef.current = r)}>
      <div className="btn-group">
        {buttons.map((button, key) => (
          <div className="btn-item" key={key}>
            {button.name !== TOOLS_BAR_BUTTON.PLACEHOLDER && (
              <IconButton
                text={button.name}
                onClick={() => handleClick(button.name)}
              >
                {button.icon}
              </IconButton>
            )}
          </div>
        ))}
      </div>
      <ProjectInfoModal
        title="修改主题信息"
        centered
        destroyOnClose
        getContainer={thisRef.current || false}
        visible={projectInfoVisible}
        onCancel={() => setProjectInfoVisible(false)}
        onOk={() => setProjectInfoVisible(false)}
      />
    </StyleToolsBar>
  );
};

const StyleToolsBar = styled.div`
  width: 100%;
  padding: 10px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  /* justify-content: space-between; */
  box-sizing: border-box;
  .btn-group {
    display: flex;
    .btn-item {
      width: 50px;
      margin: 0 10px;
    }
  }
`;
export default ToolsBar;
