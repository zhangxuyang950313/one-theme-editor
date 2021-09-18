import io from "socket.io-client";
import { useEffect, useState } from "react";
import { HOST, PORT } from "src/common/config";
import { SOCKET_EVENT } from "src/common/socketConf";
import apiConfig from "src/common/apiConf";
import { UnionTupleToObjectKey } from "src/types/request";

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

export function usePackProject(): (
  data: UnionTupleToObjectKey<typeof apiConfig.PACK_PROJECT.query>,
  cb: (x: string) => void
) => void {
  const URL = `http://${HOST}:${PORT}`;
  const [socket] = useState(io(`${URL}`));
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    data: UnionTupleToObjectKey<typeof apiConfig.PACK_PROJECT.query>,
    cb: (x: string) => void
  ) => {
    socket.emit(SOCKET_EVENT.PACK, data);
    socket.on(SOCKET_EVENT.PACK, cb);
  };
}
