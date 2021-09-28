import { Socket } from "socket.io";
import SocketConfig from "src/common/socketConf";
import ScenarioOptions from "server/compiler/ScenarioOptions";
import PackageUtil from "server/utils/PackageUtil";
import { TypePackProcess } from "src/types/socket";
import { SocketInvoker } from "./util";

// 打包工程
export default function packProject(socket: Socket): void {
  const { pack } = SocketConfig;
  new SocketInvoker<TypePackProcess, typeof pack.sendData>(socket)
    .event(pack.event)
    .on(async (data, emit) => {
      console.log("打包参数", data);
      const { scenarioMd5, packDir, outputFile } = data;
      const packConfig = ScenarioOptions.def.getPackConfigByMd5(scenarioMd5);
      if (!packConfig) {
        emit({ msg: "未配置打包规则", data: null });
        return;
      }
      const files = await PackageUtil.pack({
        packConfig,
        packDir,
        outputFile,
        onProcess(data: TypePackProcess) {
          emit(data);
        }
      });
      emit({ msg: "完成", data: files });
    });
}
