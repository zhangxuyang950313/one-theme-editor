import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useServerHost } from "../index";

let socket: Socket;
function createSocket(url: string) {
  return socket || io(url);
}

// 获取 socket 实例
export default function useSocket(): Socket {
  const url = useServerHost();
  const [socket] = useState(createSocket(url));
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
  return socket;
}
