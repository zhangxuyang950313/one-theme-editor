// 主进程 globalThis
declare const $one: {
  readonly $server: typeof import("src/ipc/ipcController").default;
  readonly $invoker: typeof import("src/ipc/ipcInvoker").default;
  readonly $reactive: typeof import("src/common/singletons/reactiveState").default;
  readonly $path: typeof import("src/common/utils/PathUtil").default;
};

// file://./../main/singletons/workers.ts
declare const $workers = (await import("src/main/singletons/workers")).default;
