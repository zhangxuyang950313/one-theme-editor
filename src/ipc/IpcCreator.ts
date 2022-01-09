import { ipcMain, ipcRenderer, IpcRendererEvent } from "electron";
import LogUtil from "src/common/utils/LogUtil";

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

/**
 * ipc 创建器基类，被 ipcController 类继承
 * 将主进程和渲染进程代码就近管理
 * 每一条服务中要向 server 中注册 ipcMain 的监听：this.addServer(() => {})
 * 返回一个调用函数，将会被渲染进程调用
 */
export default class ipcCreator {
  private serverList: Array<() => void> = [];

  // 收集服务
  private addServer(server: () => void) {
    if (!ipcMain) return;
    this.serverList.push(server);
  }

  // 创建同步 ipc 调用
  protected createIpcSync<Params, Result>(option: {
    event: IPC_EVENT;
    server: (p: Params) => Result;
  }): (params: Params) => Result {
    this.addServer(() => {
      ipcMain.on(option.event, ($event, $data: Params) => {
        $event.returnValue = option.server($data);
      });
    });
    return (params: Params): Result => {
      const start = process.uptime();
      const result = ipcRenderer.sendSync(option.event, params);
      // if (isDev) {
      const time = (process.uptime() - start) * 1000;
      LogUtil.ipc("sync", `${option.event}(${time.toFixed(5)}ms)`);
      console.log("→", params);
      console.log("←", result);
      // }
      return result;
    };
  }

  // 创建异步 ipc 调用
  protected createIpcAsync<Params, Result>(option: {
    event: IPC_EVENT;
    server: (p: Params) => Promise<Result>;
  }): (params: Params) => Promise<Result> {
    this.addServer(() => {
      // 直接 throw 会带上 invoke 原本的错误信息
      // 所以这里用 status: 'failed' 来标识错误
      ipcMain.handle(option.event, async ($event, $data: Params) => {
        try {
          return {
            status: "success",
            data: await option.server($data),
            message: "success"
          };
        } catch (err: any) {
          // console.log(err);
          return {
            status: "failed",
            data: null,
            message: err.message
          };
        }
      });
    });
    return async (params: Params): Promise<Result> => {
      const start = process.uptime();
      const result = await ipcRenderer.invoke(option.event, params);
      // if (isDev) {
      const time = (process.uptime() - start) * 1000;
      LogUtil.ipc("async", `${option.event}(${time.toFixed(5)}ms)`);
      console.log("→", params);
      console.log("←", result);
      // }
      if (result.status === "failed") {
        throw new Error(result.message);
      }
      return result.data;
    };
  }

  /**
   * 创建回调 ipc 调用，用于多频次回调
   * TODO: 解决多次调用多次注册 bug，后再去掉 deprecated
   * @deprecated
   * @param option
   * @returns
   */
  protected createIpcCallback<Params, CP>(option: {
    event: IPC_EVENT;
    server: (p: Params, cb: (cp: CP) => void) => void;
  }): (params: Params, callback: (cp: CP) => void) => void {
    this.addServer(() => {
      ipcMain.on(option.event, async ($event, $data: Params) => {
        option.server($data, data => {
          $event.reply(option.event, data);
        });
      });
    });
    return (params: Params, callback: (x: CP) => void) => {
      LogUtil.ipc("call", `${option.event}`);
      console.log("→", params);
      ipcRenderer.on(option.event, ($event: IpcRendererEvent, $data: CP) => {
        // if (isDev) {
        LogUtil.ipc("back", `${option.event}`);
        console.log("←", $data);
        // }
        callback($data);
      });
      ipcRenderer.send(option.event, params);
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
