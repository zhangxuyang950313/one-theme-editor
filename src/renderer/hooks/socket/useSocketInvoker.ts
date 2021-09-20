import { SOCKET_EVENT } from "src/common/socketConf";
import useSocket from "./useSocket";

/**
 * 封装 socket 事件
 * @param event
 * @returns
 *
 * ```
 * const socket = useSocketEvent("event");
 * // 用法1
 * socket.emit({ data: "发送数据" })
 * socket.on(data => {
 *  // 收到相应数据
 *  console.log(data);
 * })
 * // 用法2
 * socket.emit({ data: "发送数据" }, data => {
 *  // 收到相应数据
 *  console.log(data);
 * })
 * ```
 */
export default function useSocketInvoker<Send, Receive>(
  event: SOCKET_EVENT
): {
  emit: (data: Send, cb?: (data: Receive) => void) => void;
  on: (cb: (data: Receive) => void) => void;
} {
  const socket = useSocket();
  // socket 作出响应
  const on = (cb: (data: Receive) => void) => {
    socket.on(event, cb);
  };
  // 发送 socket 请求
  const emit = (data: Send, cb?: (data: Receive) => void) => {
    socket.emit(event, data);
    if (cb) on(cb);
  };
  return { emit, on };
}
