import { useEditorDispatch } from "@/store";
import { ActionPatchProjectSourceData } from "@/store/editor/action";
import { useEffect } from "react";
import { SOCKET_EVENT } from "src/common/socketConf";
import { TypeSyncFileContent } from "src/types/socket";
import { useSourceDefineList } from "../source";
import useSocket from "../socket/useSocket";
import { useProjectRoot } from "./index";

export default function useWatchProjectFile(): void {
  const socket = useSocket();
  const projectRoot = useProjectRoot();
  const sourceDefineList = useSourceDefineList();
  const dispatch = useEditorDispatch();
  useEffect(() => {
    if (!projectRoot || sourceDefineList.length === 0) return;
    socket.on(SOCKET_EVENT.FILE_CHANGE, (data: TypeSyncFileContent) => {
      dispatch(ActionPatchProjectSourceData(data.data));
    });
    socket.emit(SOCKET_EVENT.WATCH_FILES, {
      options: { cwd: projectRoot },
      files: Array.from(new Set(sourceDefineList.map(item => item.src)))
    });
  }, [projectRoot, sourceDefineList]);
}
