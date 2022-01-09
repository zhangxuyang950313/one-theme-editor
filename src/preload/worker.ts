import os from "os";
import cluster from "cluster";
import process from "process";

console.log(cluster.isMaster);

type TypeWorkerMessage = { id: string } & (
  | {
      type: "start";
      index: number;
    }
  | {
      type: "decode9patch";
      files: string[];
    }
);

/**
 * @deprecated
 */
export default function init(): void {
  // 启动集群
  if (cluster.isMaster) {
    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
    Object.entries(cluster.workers).forEach(([, worker], index) => {
      if (!worker) {
        console.warn("worker 异常");
        return;
      }
      worker.on("message", message => {
        console.log({ message });
      });
      worker.send({
        type: "index",
        index
      });
    });
  } else {
    process.on("message", (msg: TypeWorkerMessage) => {
      console.log(msg);
      switch (msg.type) {
        case "start": {
          console.log(`worker: ${msg.index} start`);
          break;
        }
        case "decode9patch": {
          console.log(Buffer.isBuffer(msg.files));
          break;
        }
      }
    });
  }
}
