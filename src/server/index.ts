import cluster from "cluster";
import os from "os";
// import http from "http";

const cpuCount = os.cpus().length;

export default class ClusterServer {
  constructor() {
    this.init();
  }

  init(): void {
    if (cluster.isMaster) {
      console.log(`主进程 ${process.pid} 正在运行`);

      // 衍生工作进程。
      for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
      }

      cluster.on("exit", (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
      });
    } else {
      // 工作进程可以共享任何 TCP 连接。
      // 在本例子中，共享的是 HTTP 服务器。
      // http
      //   .createServer((req, res) => {
      //     console.log(req);
      //     res.writeHead(200);
      //     res.end("hello world\n");
      //   })
      //   .listen(8000);
      console.log(`工作进程 ${process.pid} 已启动`);
    }

    cluster.addListener("message", console.log);
  }
}
