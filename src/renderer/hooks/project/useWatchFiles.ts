import { SOCKET_EVENT } from "src/constant/socketConf";
import useSocket from "../socket/useSocket";

export default function useWatchFiles(): (
  files: string | ReadonlyArray<string>
) => void {
  const socket = useSocket();
  return (files: string | ReadonlyArray<string>) => {
    socket.emit(SOCKET_EVENT.WATCH_FILES, files);
  };
}
