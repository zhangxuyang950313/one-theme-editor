import * as electronStore from "src/store/index";
import ipcServer from "src/ipc/IpcServer";
import ipcInvoker from "src/ipc/IpcInvoker";
import reactiveState from "./reactiveState";

// 注册 ipc 服务调用
Object.assign(global, {
  $server: ipcServer,
  $invoker: ipcInvoker
});

// 注册 electron store 实例
Object.assign(global, {
  $electronStore: electronStore
});

// 注册跨进程响应式数据
Object.assign(global, {
  $reactiveState: reactiveState
});
