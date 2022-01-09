import { wrap } from "comlink";
import nodeEndpoint from "comlink/dist/umd/node-adapter";
import PathUtil from "src/common/utils/PathUtil";
import NinePatchUtil from "src/common/utils/NinePatchUtil";
import WorkerExecutor from "src/common/classes/WorkerExecutor";

const work = new WorkerExecutor(PathUtil.WORKERS.ninePatch);
const ninePatch = wrap<NinePatchUtil>(nodeEndpoint(work));

const workers = {
  ninePatch
};

export default workers;
