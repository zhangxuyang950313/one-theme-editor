import { SOCKET_EVENT } from "src/common/socketConf";
import useSocket from "./useSocket";

/**
 * 封装同事件 socket 调用
 * @param event
 * @returns
 *
 * ```
 * const socket = useSocketEvent("event");
 * // 用法1：先调用 socket.on 监听回调函数，再进行 socket.emit
 * socket.on(data => {
 *  // 收到相应数据
 *  console.log(data);
 * })
 * socket.emit({ data: "发送数据" })
 *
 * // 用法2：调用 socket.emit，第二个参数传入回调函数
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
