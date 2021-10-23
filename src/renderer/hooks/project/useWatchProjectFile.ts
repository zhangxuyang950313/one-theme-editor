import { useEffect } from "react";
import { SOCKET_EVENT } from "src/constant/socketConf";
import { FILE_EVENT } from "src/enum";
import { TypeSyncFileContent, TypeWatchFilesPayload } from "src/types/socket";
// import { useEditorDispatch } from "@/store";
import { useResourceDefList } from "../resource";
import useSocket from "../socket/useSocket";
import { useProjectRoot } from "./index";

/**
 * @deprecated
 * 监听当前页面文件
 */
export default function useWatchProjectFile(): void {
  const socket = useSocket();
  const projectRoot = useProjectRoot();
  const resourceList = useResourceDefList();
  // const dispatch = useEditorDispatch();
  useEffect(() => {
    if (!projectRoot || resourceList.length === 0) return;
    const files = Array.from(
      new Set(
        resourceList.reduce<string[]>((prev, item) => {
          item.children.forEach(o => {
            o.items.forEach(oo => {
              prev.push(oo.source);
            });
          });
          return prev;
        }, [])
      )
    );
    socket.on(
      SOCKET_EVENT.FILE_CHANGE,
      (data: TypeSyncFileContent, cb: () => void) => {
        cb && cb();
        // 文件变动
        switch (data.event) {
          // 增加和变更给 fileDataMap 打补丁
          case FILE_EVENT.ADD:
          case FILE_EVENT.ADD_DIR:
          case FILE_EVENT.CHANGE: {
            // dispatch(ActionPatchFileData(data.data));
            break;
          }
          // 删除则删掉 fileDataMap 对应的文件内容
          case FILE_EVENT.UNLINK: {
            // dispatch(ActionRemoveFileData(data.file));
          }
        }
      }
    );
    socket.emit(SOCKET_EVENT.WATCH_FILES, {
      options: {
        cwd: projectRoot,
        // persistent: true,
        usePolling: true,
        interval: 0,
        binaryInterval: 0
      },
      files
    } as TypeWatchFilesPayload);
    return () => {
      socket.emit(SOCKET_EVENT.UNWATCH_FILES, files);
    };
  }, [projectRoot, resourceList]);
}
