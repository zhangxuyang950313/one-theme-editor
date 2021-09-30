import path from "path";
import { useEditorDispatch } from "@/store";
import { useEffect } from "react";
import { SOCKET_EVENT } from "src/common/socketConf";
import useSocket from "../socket/useSocket";
import { useProjectInfoConfig, useProjectRoot } from "./index";

export default function useCreateFileWatcher(): void {
  const projectRoot = useProjectRoot();
  const projectInfoConfig = useProjectInfoConfig();
  const socket = useSocket();
  const dispatch = useEditorDispatch();
  useEffect(() => {
    if (!projectRoot) return;
    const srcList = [path.normalize(projectInfoConfig.output)];
    socket.emit(SOCKET_EVENT.CREATE_FILE_WATCHER, projectRoot);
    // syncFileContent.emit({ projectRoot, srcList });
    // syncFileContent.on(data => {
    //   if (srcList[0] === data.file) {
    //     console.log(data);
    //     dispatch(ActionPatchProjectSourceData(data.data));
    //   }
    // });
  }, [projectRoot]);
}
