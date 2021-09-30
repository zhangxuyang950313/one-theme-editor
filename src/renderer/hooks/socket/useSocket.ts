import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import electronStore from "src/common/electronStore";

let socket: Socket;
function createSocket(url: string) {
  return socket || (socket = io(url));
}

// 获取 socket 实例
export default function useSocket(): Socket {
  const hostname = electronStore.get("hostname");
  const [socket] = useState(createSocket(`http://${hostname}`));
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
  return socket;
}
