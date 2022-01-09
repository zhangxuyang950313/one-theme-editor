import Workers from "src/common/classes/Workers";
import WORKER_TYPES from "src/common/enums/worker-types";
import PathUtil from "src/common/utils/PathUtil";
import { TypeResponseMsg } from "src/types/worker";

export default class NinePatchWorker {
  private id = 0;
  private cbMap = new Map<number, () => void>();
  private worker = Workers.createWorker(PathUtil.WORKERS.ninePatch).on(
    "message",
    (data: TypeResponseMsg<WORKER_TYPES.ENCODE_9_PATCH>) => {
      const callback = this.cbMap.get(data.id);
      if (callback) {
        callback();
        this.cbMap.delete(data.id);
      } else {
        console.warn(`[NinePatchWorker] worker ${data.id} does not has callback`);
      }
    }
  );
  // 批量处理.9图文件
  encodeBatch(files: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cbMap.set(++this.id, resolve);
      this.worker.send({ id: this.id, files });
    });
  }
}
