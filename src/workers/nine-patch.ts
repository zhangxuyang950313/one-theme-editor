import { parentPort } from "worker_threads";

import { expose } from "comlink";
import nodeEndpoint from "comlink/dist/umd/node-adapter";
import NinePatchUtil from "src/common/utils/NinePatchUtil";

if (parentPort) {
  expose(NinePatchUtil, nodeEndpoint(parentPort));
} else {
  console.warn("[worker:nine-patch]: parentPort is null");
}
