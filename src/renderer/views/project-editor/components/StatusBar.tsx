import { remote } from "electron";
import React from "react";
import styled from "styled-components";
import { FolderOpenOutlined } from "@ant-design/icons";
import { useEditorSelector } from "../store";

const StatusBar: React.FC<React.HTMLAttributes<HTMLDivElement>> = props => {
  const projectData = useEditorSelector(state => state.projectData);
  return (
    <StyleStatusBar {...props}>
      <span
        className="project-name"
        title="跳转目录"
        onClick={() => {
          remote.shell.openItem(`${projectData.root}`);
        }}
      >
        <FolderOpenOutlined className="icon" />
        {projectData.description.name}
      </span>
    </StyleStatusBar>
  );
};

const StyleStatusBar = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
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
`;

export default StatusBar;
