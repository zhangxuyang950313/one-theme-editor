import { ipcMain, BrowserWindow } from "electron";
import IPC_EVENT from "src/enum/ipc-event";
import ScenarioConfigCompiler from "src/server/compiler/ScenarioConfig";
import windows from "src/main/windows";
import { TypeScenarioConfig } from "src/types/scenario.config";

// 生成 ipcMain 调用
function generateIpcMain<T, C extends unknown>(
  event: IPC_EVENT,
  handler: (data: T) => Promise<C> | C
): void {
  ipcMain.on(event, async ($event, $data: T) => {
    try {
      const data = await handler($data);
      $event.reply(event, {
        type: "success",
        data: data
      });
    } catch (err: any) {
      console.log(err);
      $event.reply(event, {
        type: "fail",
        data: err.message
      });
    }
  });
}

const mainIpc = {
  // 监听打开创建工程窗口
  registerOpenCreateProject(win: BrowserWindow): void {
    generateIpcMain<string, void>(IPC_EVENT.$createProject, scenarioSrc => {
      windows.createProject(win, scenarioSrc);
    });
  },
  // 注册服务
  registerServer(): void {
    // 获取场景选项
    generateIpcMain<string, TypeScenarioConfig>(
      IPC_EVENT.$getScenarioOption,
      scenarioSrc => ScenarioConfigCompiler.from(scenarioSrc).getConfig()
    );
  }
};

export default mainIpc;
