import React from "react";
import { Popover, Progress } from "@arco-design/web-react";

import { useRecoilValue } from "recoil";

import { packProgressState } from "../../store/rescoil/state";

import { StyleIconItemArea } from "./style";

const Task: React.FC = () => {
  const progressData = useRecoilValue(packProgressState);

  return (
    <Popover
      popupVisible={progressData.progress !== -1}
      title="后台任务"
      content={
        <div>
          {progressData.message}
          <Progress percent={progressData.progress} />
        </div>
      }
    >
      <StyleIconItemArea>
        <Progress size="mini" showText={false} percent={progressData.progress} />
        <span className="content">{progressData.message}</span>
      </StyleIconItemArea>
    </Popover>
  );
};

export default Task;
