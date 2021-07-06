import path from "path";
import React, { useContext } from "react";
import styled from "styled-components";
import { remote } from "electron";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useProjectPathname } from "@/hooks/project";
import Context from "./Context";

const SourceStatus: React.FC = () => {
  const projectPathname = useProjectPathname();
  const { releaseList, dynamicReleaseList } = useContext(Context);

  if (!projectPathname) return null;

  return (
    <>
      {releaseList.map(relativePath => {
        const basename = path.basename(relativePath);
        // const hasIt = fse.existsSync(path.join(projectPathname, relativePath));
        const hasIt = new Set(dynamicReleaseList).has(relativePath);
        const absPath = path.join(projectPathname, relativePath);
        return (
          <StyleSourceStatus
            key={basename}
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
          </StyleSourceStatus>
        );
      })}
    </>
  );
};

const StyleSourceStatus = styled.span`
  display: inline-block;
  margin-bottom: 6px;
  max-width: 100%;
  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
  font-size: 10px;
  color: ${({ theme }) => theme["@text-color-secondary"]};
  user-select: text;
  /* overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
  &[data-exists="true"] {
    cursor: pointer;
  }
  &[data-exists="false"] {
    opacity: 0.5;
  }
`;

export default SourceStatus;
