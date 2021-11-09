declare const $one: {
  readonly $server: typeof import("src/ipc/ipcController").default;
  readonly $invoker: typeof import("src/ipc/ipcInvoker").default;
  readonly $reactiveState: typeof import("src/main/singletons/reactiveState").default;
  readonly $path: typeof import("src/common/utils/PathUtil").default;
};
