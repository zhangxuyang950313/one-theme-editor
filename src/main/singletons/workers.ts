import Workers from "src/common/classes/Workers";
import WORKER_TYPES from "src/common/enums/worker-types";
import PathUtil from "src/common/utils/PathUtil";
// import { getRandomUUID } from "src/common/utils";
import { TypeResponseMsg } from "src/types/worker";

class NinePatchWorker {
  private id = 0;
  private cbMap = new Map<number, () => void>();
  private worker = Workers.createWorker(PathUtil.WORKERS.ninePatch).on(
    "message",
    (data: TypeResponseMsg<WORKER_TYPES.ENCODE_9_PATCH>) => {
      const callback = this.cbMap.get(data.id);
      if (callback) {
        callback();
        this.cbMap.delete(data.id);
      }
    }
  );
  encodeBatch(files: string[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.cbMap.set(++this.id, () => {
        resolve();
      });
      this.worker.send({ id: this.id, files });
    });
  }
}

const workers = {
  ninePatch: new NinePatchWorker()
};

export default workers;

// 注册到主进程
Object.defineProperty(global, "$workers", {
  value: workers,
  writable: false,
  configurable: false
});
