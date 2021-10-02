import { useEditorDispatch } from "@/store";
import { ActionPatchProjectFileData } from "@/store/editor/action";
import { useEffect } from "react";
import { SOCKET_EVENT } from "src/constant/socketConf";
import { TypeSyncFileContent } from "src/types/socket";
import { useResDefinitionList } from "../resource";
import useSocket from "../socket/useSocket";
import { useProjectRoot } from "./index";

// 监听当前页面文件
export default function useWatchProjectFile(): void {
  const socket = useSocket();
  const projectRoot = useProjectRoot();
  const resourceList = useResDefinitionList();
  const dispatch = useEditorDispatch();
  useEffect(() => {
    if (!projectRoot || resourceList.length === 0) return;
    const files = Array.from(new Set(resourceList.map(item => item.src)));
    socket.on(SOCKET_EVENT.FILE_CHANGE, (data: TypeSyncFileContent) => {
      dispatch(ActionPatchProjectFileData(data.data));
    });
    socket.emit(SOCKET_EVENT.WATCH_FILES, {
      options: { cwd: projectRoot, persistent: true },
      files
    });
    return () => {
      socket.emit(SOCKET_EVENT.UNWATCH_FILES, files);
    };
  }, [projectRoot, resourceList]);
}
