import path from "path";
import { remote } from "electron";
import React, { useContext } from "react";

import { useProjectPathname } from "@/hooks/project";

import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import Context from "./Context";

const SourceStatus: React.FC = props => {
  const projectPathname = useProjectPathname();
  const { releaseList, dynamicReleaseList } = useContext(Context);

  if (!projectPathname) return null;

  return (
    <div>
      {releaseList.map(relativePath => {
        const basename = path.basename(relativePath);
        // const hasIt = fse.existsSync(path.join(projectPathname, relativePath));
        const hasIt = new Set(dynamicReleaseList).has(relativePath);
        const absPath = path.join(projectPathname, relativePath);
        return (
          <p
            key={basename}
            className="text to-basename"
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
          </p>
        );
      })}
    </div>
  );
};

export default SourceStatus;
