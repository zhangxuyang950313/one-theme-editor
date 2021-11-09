import ipcController from "src/ipc/ipcController";
import ipcInvoker from "src/ipc/ipcInvoker";
import reactiveState from "src/common/singletons/reactiveState";
import PathUtil from "src/common/utils/PathUtil";

Object.defineProperty(global, "$one", {
  value: new Proxy(
    {
      // 注册 ipc 服务
      $server: ipcController,
      $invoker: ipcInvoker,
      // 注册跨进程响应式数据
      $reactiveState: reactiveState,
      $path: PathUtil
    },
    {
      // 禁止外部更改
      set() {
        return false;
      }
    }
  ),
  writable: false,
  configurable: false
});
