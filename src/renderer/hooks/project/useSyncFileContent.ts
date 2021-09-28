import path from "path";
import { useEditorDispatch } from "@/store";
import { useEffect } from "react";
import { ActionPatchProjectSourceData } from "@/store/editor/action";
import SocketConfig from "src/common/socketConf";
import useSocketInvoker from "../socket/useSocketInvoker";
import { useProjectInfoConfig, useProjectRoot } from "./index";

const { event, sendData, receiveData } = SocketConfig.syncFileContent;

function useSyncProjectInfo() {
  const projectRoot = useProjectRoot();
  const projectInfoConfig = useProjectInfoConfig();
  const syncFileContent = useSocketInvoker<typeof sendData, typeof receiveData>(
    event
  );
  const dispatch = useEditorDispatch();
  useEffect(() => {
    if (!projectRoot) return;
    const srcList = [path.normalize(projectInfoConfig.output)];
    syncFileContent.emit({ projectRoot, srcList });
    syncFileContent.on(data => {
      if (srcList[0] === data.file) {
        console.log(data);
        dispatch(ActionPatchProjectSourceData(data.data));
      }
    });
  }, [projectRoot]);
}

export default function useSyncFileContent(): void {
  useSyncProjectInfo();
}
