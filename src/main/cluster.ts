import os from "os";
import cluster from "cluster";

const cupCount = os.cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < cupCount; i++) {
    cluster.fork({
      isWorker: "true"
    });
  }
} else if (cluster.isWorker) {
  import("../workers/nine-patch");
}
