import { ChildProcess } from "child_process";

// import comlink from "comlink"
// comlink.wrap

export default class WorkerExecutor {
  private static id = 0;
  static wrap<T>(worker: ChildProcess): T {
    worker.on("message", data => {
      //
    });
    return new Proxy({} as T, {
      get(_target, prop) {
        worker.send({ id: ++WorkerExecutor.id, prop });
      }
    });
  }

  static expose<T extends Record<string, any>>(obj: T): void {
    process.on("message", (data: { id: string; prop: string }) => {
      if (typeof obj[data.prop] === "function") {
        obj[data.prop]();
      }
    });
  }
}
