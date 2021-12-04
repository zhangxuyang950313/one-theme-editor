import { shell } from "@electron/remote";
import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { FolderOpenOutlined } from "@ant-design/icons";

import { projectDataState } from "../store/rescoil/state";

const StatusBar: React.FC<React.HTMLAttributes<HTMLDivElement>> = props => {
  const { projectData } = useRecoilValue(projectDataState);
  return (
    <StyleStatusBar {...props}>
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
