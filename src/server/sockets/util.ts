import { Socket } from "socket.io";
import { SOCKET_EVENT } from "src/constant/socketConf";

// // 快速将 socket event 建立通讯通道
// class SocketConnecter {
//   private socket: Socket;
//   constructor(socket: Socket) {
//     this.socket = socket;
//   }
//   // 快速注册 socket 的通讯协议
//   connect<P, R, T>(
//     event: SOCKET_EVENT,
//     method: (data: P, cb: (d: R) => void) => Promise<T> | T
//   ) {
//     this.socket.on(event, (data: P) => {
//       method(data, data => {
//         this.socket.emit(event, data);
//       });
//     });
//   }
// }

/**
 * 创建基于相同 event 事件的双工通讯 socket
 * @param event
 * @param socket
 * @returns
 *
 * ```
 * import { Server } from "socket.io";
 * // 创建 io 实例
 * const io = new Server(server);
 *
 * io.on("connection", socket => {
 *  // 用法1
 *  createSocketInvoker("event", socket).on((data, emit) => {
 *    // use data to do something
 *    // use emit to send message to client
 *  });
 *  // 用法2
 *  const invoker = createSocketInvoker("event", socket);
 *  invoker.on((data, emit) => {
 *    // use data to do something
 *    // use invoker.emit to send message to client
 *    // invoker.emit 等价于 emit
 *    invoker.emit();
 *  });
 * })
 * ```
 */
export function createSocketInvoker<S, R>(
  event: SOCKET_EVENT,
  socket: Socket
): {
  emit: (data: S) => void;
  on: (cb: (data: R, emit: (data: S) => void) => void) => void;
} {
  const emit = (data: S) => {
    socket.emit(event, data);
  };
  const on = (cb: (data: R, emit: (data: S) => void) => void) => {
    socket.on(event, (data: R) => {
      cb(data, emit);
    });
  };
  return { emit, on };
}

/**
 * 和上述性质一样，只是 event 可以作为链式调用来传入
 * ```
 * import { Server } from "socket.io";
 * // 创建 io 实例
 * const io = new Server(server);
 *
 * io.on("connection", socket => {
 *  // 用法1
 *  new SocketInvoker(socket)
 *   .event(pack.event)
 *   .on((data, emit) => {
 *      // use data to do something
 *      // use emit to send message to client
 *    });
 *  //用法2
 *  const invoker = new SocketInvoker(socket);
 *  invoker.on((data, emit) => {
 *    // use data to do something
 *    // use invoker.emit to send message to client
 *    // invoker.emit 等价于 emit
 *    invoker.emit();
 *  })
 * })
 * ```
 */
export class SocketInvoker<S, R> {
  private socket: Socket;
  private socketEvent!: SOCKET_EVENT;
  constructor(socket: Socket) {
    this.socket = socket;
  }

  event(e: SOCKET_EVENT): this {
    this.socketEvent = e;
    return this;
  }

  emit(data: S): this {
    this.socket.emit(this.socketEvent, data);
    return this;
  }

  on(cb: (data: R, emit: (data: S) => void) => void): this {
    this.socket.on(this.socketEvent, (data: R) => {
      cb(data, this.emit.bind(this));
    });
    return this;
  }
}
