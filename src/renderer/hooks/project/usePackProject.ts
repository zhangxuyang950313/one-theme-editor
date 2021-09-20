import SocketConfig from "src/common/socketConf";
import useSocketInvoker from "../socket/useSocketInvoker";

const { sendData, receiveData, event } = SocketConfig.pack;
export default function usePackProject<
  S = typeof sendData,
  R = typeof receiveData
>(): (data: S, cb: (x: R) => void) => void {
  const socket = useSocketInvoker<S, R>(event);
  return socket.emit;
}
