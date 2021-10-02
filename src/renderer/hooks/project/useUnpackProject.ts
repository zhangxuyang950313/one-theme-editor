import SocketConfig from "src/constant/socketConf";
import useSocketInvoker from "../socket/useSocketInvoker";

const { sendData, receiveData, event } = SocketConfig.unpack;
export default function useUnpackProject<
  S = typeof sendData,
  R = typeof receiveData
>(): (data: S, cb: (x: R) => void) => void {
  const socket = useSocketInvoker<S, R>(event);
  return socket.emit;
}
