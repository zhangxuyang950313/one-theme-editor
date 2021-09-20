import SocketConfig from "src/common/socketConf";
import useSocketEvent from "./useSocketEvent";

// export function useSocket<E extends SOCKET_EVENT, P, R>(
//   event: E,
//   opt: {
//     ns: string;
//     onReceived: (x: R) => void;
//   }
// ): {
//   emit: (x: P) => void;
// } {
//   const URL = `http://${HOST}:${PORT}`;
//   const socket = io(`${URL}${opt.ns}`);
//   socket.on(event, (data: R) => {
//     opt.onReceived(data);
//   });

//   const emit = (data: P) => {
//     socket.emit(event, data);
//   };

//   return { emit };
// }

const { sendData, receiveData, event } = SocketConfig.unpack;
export default function useUnpackProject<
  S = typeof sendData,
  R = typeof receiveData
>(): (data: S, cb: (x: R) => void) => void {
  const socket = useSocketEvent<S, R>(event);
  return socket.emit;
}
