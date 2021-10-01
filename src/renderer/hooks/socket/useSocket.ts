import { useEffect, useState } from "react";
import {
  io,
  Socket
  // ManagerOptions, SocketOptions
} from "socket.io-client";
import electronStore from "src/common/electronStore";

// // 单例模式
// let socket: Socket;
// function createSocket(
//   url: string,
//   options?: Partial<ManagerOptions & SocketOptions>
// ) {
//   return socket || (socket = io(url, options));
// }

// 获取 socket 实例
export default function useSocket(): Socket {
  const hostname = electronStore.get("hostname");
  const [socket] = useState(io(`http://${hostname}`, { autoConnect: false }));
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);
  return socket;
}
