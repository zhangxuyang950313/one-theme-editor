import SocketConfig from "src/common/socketConf";
import useSocketEvent from "./useSocketEvent";

const { sendData, receiveData, event } = SocketConfig.pack;
export default function usePackProject<
  S = typeof sendData,
  R = typeof receiveData
>(): (data: S, cb: (x: R) => void) => void {
  const socket = useSocketEvent<S, R>(event);
  return socket.emit;
}
