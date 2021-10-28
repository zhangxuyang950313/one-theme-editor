import { useEffect, useState } from "react";
import { io, Socket, ManagerOptions, SocketOptions } from "socket.io-client";
import * as electronStore from "src/store";

// 单例模式
let socket: Socket;
function createSocket(
  url: string,
  options?: Partial<ManagerOptions & SocketOptions>
) {
  return socket || (socket = io(url, options));
}

// 获取 socket 实例
export default function useSocket(): Socket {
  const hostname = electronStore.config.get("hostname");
  const [socket] = useState(
    createSocket(`http://${hostname}`, { autoConnect: false })
  );
  useEffect(() => {
    if (socket.disconnected) {
      socket.connect();
    }
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);
  return socket;
}
