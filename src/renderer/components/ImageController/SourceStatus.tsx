import path from "path";
import React from "react";
import styled from "styled-components";
import { remote } from "electron";
import { Tooltip } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useProjectPathname } from "@/hooks/project";

const SourceStatus: React.FC<{
  releaseList: string[];
  dynamicReleaseList: string[];
}> = props => {
  const { releaseList, dynamicReleaseList } = props;
  const projectPathname = useProjectPathname();

  if (!projectPathname) return null;

  return (
    <>
      {releaseList.map((pathname, index) => {
        const basename = path.basename(pathname);
        // const hasIt = fse.existsSync(path.join(projectPathname, relativePath));
        const hasIt = new Set(dynamicReleaseList).has(pathname);
        const absPath = path.join(projectPathname, pathname);
        return (
          <Tooltip
            key={`${basename}-${index}`}
            title={pathname}
            placement="top"
          >
            <StyleSourceStatusLine
              title={pathname}
              data-exists={String(hasIt)}
              onClick={() => hasIt && remote.shell.showItemInFolder(absPath)}
            >
              {hasIt ? (
                <CheckCircleTwoTone twoToneColor="#52c41a" />
              ) : (
                <CloseCircleTwoTone twoToneColor="#ff0000" />
              )}
              &ensp;
              {basename}
            </StyleSourceStatusLine>
          </Tooltip>
        );
      })}
    </>
  );
};

const StyleSourceStatusLine = styled.p`
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
