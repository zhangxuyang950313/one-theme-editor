import { ipcMain, ipcRenderer } from "electron";
import { isDev } from "../common/utils/index";
import IPC_EVENT from "./ipc-event";

// type TypeCallbackReply<T> = {
//   success: (data: T) => void;
//   fail?: (err: string) => void;
// };

// type TypeMainReply<T> /* 主进程答复 */ =
//   | { type: "success"; data: T }
//   | { type: "fail"; data: string };

// const generator = {
//   renderer: {
//     // 生成 ipcRenderer 同步调用
//     generateIpcSync<P, R>(event: IPC_EVENT) {
//       return (data?: P): R => ipcRenderer.sendSync(event, data);
//     },
//     // 生成 ipcRenderer 异步调用
//     generateIpcInvoke<P, R>(event: IPC_EVENT) {
//       return async (data: P): Promise<R> =>
//         await ipcRenderer.invoke(event, data).catch(err => {
//           console.log(err);
//           throw new Error(err.message);
//         });
//     },
//     // 生成 ipcRenderer 回调调用
//     generateIpcCallback<P, R>(event: IPC_EVENT) {
//       return (data: P, callback?: (x: R) => void) => {
//         if (callback) {
//           ipcRenderer.on(event, ($event, $data) => {
//             callback($data.data);
//           });
//         }
//         ipcRenderer.send(event, data);
//       };
//     }
//   },
//   main: {
//     // 生成 ipcMain 同步响应
//     generateIpcSync<P, R>(event: IPC_EVENT, handler: (data: P) => R) {
//       ipcMain.on(event, ($event, $data: P) => {
//         $event.returnValue = handler($data);
//       });
//     },
//     // 生成 ipcMain 异步响应
//     generateIpcHandle<P, R>(
//       event: IPC_EVENT,
//       handler: (data: P) => Promise<R>
//     ) {
//       return ipcMain.handle(event, async ($event, $data: P) => handler($data));
//     },
//     // 生成 ipcMain 回调响应
//     generateIpcCallback<P, R>(
//       event: IPC_EVENT,
//       handler: (data: P) => Promise<R> | R
//     ): void {
//       ipcMain.on(event, async ($event, $data: P) => {
//         try {
//           const data = await handler($data);
//           const reply: TypeMainReply<R> = { type: "success", data: data };
//           $event.reply(event, reply);
//         } catch (err: any) {
//           const reply: TypeMainReply<R> = { type: "fail", data: err.message };
//           $event.reply(event, reply);
//         }
//       });
//     }
//   }
// };

export default class IpcCreator {
  private serverList: Array<() => void> = [];

  // 收集服务
  private addServerList(server: () => void) {
    if (!ipcMain) return;
    this.serverList.push(server);
  }

  // 创建同步 ipc 调用
  protected createIpcSync<Params, Result>(params: {
    event: IPC_EVENT;
    server: (p: Params) => Result;
  }): (data?: Params) => Result {
    this.addServerList(() => {
      ipcMain.on(params.event, ($event, $data: Params) => {
        $event.returnValue = params.server($data);
      });
    });
    return (data?: Params): Result => {
      const result = ipcRenderer.sendSync(params.event, data);
      if (isDev) {
        console.log("---------ipc---------");
        console.log("sync", params.event);
        console.log("params", data);
        console.log("result", result);
        console.log("---------------------");
      }
      return result;
    };
  }

  // 创建异步 ipc 调用
  protected createIpcAsync<Params, Result>(params: {
    event: IPC_EVENT;
    server: (p: Params) => Promise<Result>;
  }): (data: Params) => Promise<Result> {
    this.addServerList(() => {
      ipcMain.handle(
        params.event,
        async ($event, $data: Params) => await params.server($data)
      );
    });

    return async (data: Params): Promise<Result> => {
      const result = await ipcRenderer.invoke(params.event, data).catch(err => {
        console.log(err);
        throw new Error(err.message);
      });

      if (isDev) {
        console.log("---------ipc---------");
        console.log("async", params.event);
        console.log("params", data);
        console.log("result", result);
        console.log("---------------------");
      }
      return result;
    };
  }

  // 创建回调 ipc 调用，用于多频次回调
  protected createIpcCallback<Params, CP>(params: {
    event: IPC_EVENT;
    server: (params: Params, cb: (x: CP) => void) => void;
  }): (data: Params, callback: (x: CP) => void) => void {
    this.addServerList(() => {
      ipcMain.on(params.event, async ($event, $data: Params) => {
        params.server($data, data => {
          $event.reply(params.event, data);
        });
      });
    });
    return (data: Params, callback: (x: CP) => void) => {
      ipcRenderer.on(params.event, ($event, $data) => {
        if (isDev) {
          console.log("---------ipc---------");
          console.log("callback", params.event);
          console.log("params", data);
          console.log("result", $data);
          console.log("---------------------");
        }
        callback($data);
      });
      ipcRenderer.send(params.event, data);
    };
  }

  // 注册服务
  public registerIpcServer(): void {
    if (!ipcMain) {
      console.warn("ipc server can only be registered in main process");
      return;
    }
    this.serverList.forEach(server => {
      server();
    });
  }
}
