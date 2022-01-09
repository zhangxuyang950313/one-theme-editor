import { Message } from "@arco-design/web-react";
import { useRecoilValue } from "recoil";
import PathUtil from "src/common/utils/PathUtil";
import TempStringUtil from "src/common/utils/TempStringUtil";

import { projectDataState } from "./../store/rescoil/state";

import type { TypeProgressFn } from "src/types/project";

export default function useApplyProject(
  callback: TypeProgressFn
): (data: { deviceId: string; packagedFile: string }) => Promise<void> {
  const { projectData, scenarioConfig } = useRecoilValue(projectDataState);
  const { applyConfig } = scenarioConfig;

  return async (data: { deviceId: string; packagedFile: string }) => {
    const steps = [...applyConfig.steps];
    console.log(steps);
    const replaceData = new Map(
      Object.entries({
        adb_path: PathUtil.ADB_TOOL || "adb",
        packaged_path: data.packagedFile,
        select_device_id: data.deviceId
      })
    );
    try {
      while (steps.length) {
        const step = steps.shift();
        if (!step) return;
        callback({ code: 0, data: null, msg: step.description });
        const command = TempStringUtil.replace(step.command, replaceData);
        await window.$one.$server.shellExec(command);
      }
    } catch (err: any) {
      Message.error(err);
    }
  };
}
