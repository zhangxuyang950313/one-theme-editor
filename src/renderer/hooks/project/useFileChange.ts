import { useEffect } from "react";
import { SOCKET_EVENT } from "src/common/socketConf";
import { TypeSyncFileContent } from "src/types/socket";
import useSocket from "../socket/useSocket";

export default function useFileChange(
  listener: (x: TypeSyncFileContent) => void
): void {
  const socket = useSocket();
  useEffect(() => {
    socket.on(SOCKET_EVENT.FILE_CHANGE, listener);
  }, []);
}
