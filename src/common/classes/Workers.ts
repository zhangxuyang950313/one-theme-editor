import os from "os";
import ChildProcess, { MessageOptions, SendHandle } from "child_process";

import WORKER_TYPES from "src/common/enums/worker-types";

import type { TypeMsgData, TypeResponseMsg } from "src/types/worker";

// 重写 ChildProcess.send 和 ChildProcess.on 的 message 类型
export interface TypeMyChildProcess extends ChildProcess.ChildProcess {
  send(
    message: TypeMsgData<WORKER_TYPES>,
    callback?: (error: Error | null) => void
  ): boolean;
  send(
    message: TypeMsgData<WORKER_TYPES>,
    sendHandle?: SendHandle,
    callback?: (error: Error | null) => void
  ): boolean;
  send(
    message: TypeMsgData<WORKER_TYPES>,
    sendHandle?: SendHandle,
    options?: MessageOptions,
    callback?: (error: Error | null) => void
  ): boolean;
  on(
    event: "message",
    listener: (
      message: TypeResponseMsg<WORKER_TYPES>,
      sendHandle: SendHandle
    ) => void
  ): this;
  on(
    event: "close",
    listener: (code: number | null, signal: NodeJS.Signals | null) => void
  ): this;
  on(event: "disconnect", listener: () => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(
    event: "exit",
    listener: (code: number | null, signal: NodeJS.Signals | null) => void
  ): this;
  on(event: string, listener: (...args: any[]) => void): this;
}

export default class Workers {
  static createWorker(
    modulePath: string,
    args?: ReadonlyArray<string>,
    options?: ChildProcess.ForkOptions
  ): TypeMyChildProcess {
    return ChildProcess.fork(modulePath, args, {
      ...(options || {}),
      // 高级序列化
      // http://nodejs.cn/api/child_process.html#advanced-serialization
      serialization: "advanced",
      // 必须要有 isWorker，用来做路径判断
      // 使用见 file://./../utils/PathUtil.ts
      env: { isWorker: "true" }
    });
  }

  // 工作进程列表
  private workers: Set<TypeMyChildProcess> = new Set();

  // 传入模块，设定衍生个数，默认为 cpu 核数 - 1
  constructor(modulePath: string, count = os.cpus().length - 1) {
    for (let i = 0; i < count; i++) {
      const worker = Workers.createWorker(modulePath);
      this.workers.add(worker);
    }
  }

  getWorkers(): Array<TypeMyChildProcess> {
    return [...Array.from(this.workers)];
  }
}
