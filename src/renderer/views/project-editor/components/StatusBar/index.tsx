import { shell } from "@electron/remote";
import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { Divider } from "@arco-design/web-react";
import { FolderOpenOutlined } from "@ant-design/icons";

import { IconNotification, IconQuestionCircle } from "@arco-design/web-react/icon";

import { projectDataState } from "../../store/rescoil/state";

import { StyleIconItemArea } from "./style";

import Device from "./Device";
import Task from "./Task";

const StatusBar: React.FC = () => {
  const { projectData } = useRecoilValue(projectDataState);

  return (
    <StyleStatusBar>
      <span
        className="project-name"
        title="跳转目录"
        onClick={() => {
          shell.openPath(`${projectData.root}`);
        }}
      >
        <FolderOpenOutlined className="icon" />
        {projectData.root}
      </span>
      <span className="right-status">
        <Task />
        <Divider type="vertical" />
        <Device />
        <Divider type="vertical" />
        <StyleIconItemArea>
          <IconNotification className="icon" />
          <span className="content">提示</span>
        </StyleIconItemArea>
        <Divider type="vertical" />
        <StyleIconItemArea>
          <IconQuestionCircle className="icon" />
          <span className="content">帮助</span>
        </StyleIconItemArea>
      </span>
    </StyleStatusBar>
  );
};

const StyleStatusBar = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  color: var(--color-text-1);
  .project-name {
    cursor: pointer;
    .icon {
      margin-right: 6px;
    }
    &:hover {
      text-decoration: underline;
    }
  }

  .right-status {
    display: flex;
    align-items: center;
    height: 100%;
  }
`;

export default StatusBar;
