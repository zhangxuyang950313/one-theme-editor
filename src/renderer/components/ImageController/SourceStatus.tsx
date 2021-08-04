import path from "path";
import fse from "fs-extra";
import React from "react";
import styled from "styled-components";
import { remote } from "electron";
import { Tooltip } from "antd";
import { useAbsolutePathInProject, useProjectRoot } from "@/hooks/project";

const SourceStatus: React.FC<{ src: string }> = props => {
  const { src } = props;
  const projectRoot = useProjectRoot();
  const absPathInProject = useAbsolutePathInProject(src);

  if (!projectRoot) return null;

  const basename = path.basename(src);
  const exists = fse.existsSync(absPathInProject);
  return (
    <Tooltip title={src} placement="top">
      <StyleSourceStatus
        title={src}
        data-exists={String(exists)}
        onClick={() => {
          exists && remote.shell.showItemInFolder(absPathInProject);
        }}
      >
        {basename}
      </StyleSourceStatus>
    </Tooltip>
  );
};

const StyleSourceStatus = styled.p`
  margin-bottom: 6px;
  max-width: 100%;
  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
  font-size: ${({ theme }) => theme["@text-size-secondary"]};
  color: ${({ theme }) => theme["@text-color-secondary"]};
  user-select: text;
  &[data-exists="true"] {
    cursor: pointer;
  }
  &[data-exists="false"] {
    opacity: 0.5;
  }
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default SourceStatus;
