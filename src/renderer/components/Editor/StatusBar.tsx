import { remote } from "electron";
import React from "react";
import styled from "styled-components";
import { useEditorSelector } from "@/store";

const StatusBar: React.FC = () => {
  const projectData = useEditorSelector(state => state.projectData);
  return (
    <StyleStatusBar>
      <span
        className="project-name"
        title="跳转目录"
        onClick={() => {
          remote.shell.openItem(`${projectData.root}`);
        }}
      >
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
  color: ${({ theme }) => theme["@text-color"]};
  border-top: 1px solid;
  border-top-color: ${({ theme }) => theme["@border-color-base"]};
  .project-name {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default StatusBar;