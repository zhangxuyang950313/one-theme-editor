import { BrowserWindow } from "electron";
import { isPackaged } from "src/common/utils";

// 用于添加Chromium插件
async function setupDevTools() {
  // 安装 react 开发者工具
  const {
    default: installExtension,
    // REDUX_DEVTOOLS,
    REACT_DEVELOPER_TOOLS
  } = await import("electron-devtools-installer");
  return installExtension([
    // REDUX_DEVTOOLS,
    REACT_DEVELOPER_TOOLS
  ]);
}

export async function devToolsHandler(win: BrowserWindow): Promise<void> {
  // await new Promise(resolve => win.on("ready-to-show", resolve));
  if (!isPackaged) {
    // 打开 dev 工具
    win.webContents.openDevTools();
    await setupDevTools().catch(err => {
      console.log("Dev tools install failed.", err);
    });
    // 利用 electron-debug，添加和Chrome类似的快捷键
    // import("electron-debug").then(debug => {
    //   debug.default({ isEnabled: true, showDevTools: true });
    //   debug.openDevTools();
    // });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // require("devtron").install();
  } else {
    // 生产环境不允许打开调试工具
    win.webContents.on("devtools-opened", () => {
      win.webContents.closeDevTools();
    });
  }
}
