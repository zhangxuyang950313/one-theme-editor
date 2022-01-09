import { BrowserWindowConstructorOptions } from "electron";
import { isPackaged } from "src/common/utils";

import { preloadFile } from "../constant";

const backgroundColor = "#000000";

const windowNormalizeOptions: BrowserWindowConstructorOptions = {
  webPreferences: {
    // https://www.electronjs.org/docs/tutorial/security#6-define-a-content-security-policy
    webSecurity: true,
    nodeIntegration: true,
    nodeIntegrationInWorker: true,
    allowRunningInsecureContent: false,
    // enableRemoteModule: true,
    contextIsolation: false,
    devTools: isPackaged || true,
    preload: preloadFile,
    zoomFactor: 1.0
    // maximize: true
  },
  // center: true,
  // https://www.electronjs.org/zh/docs/latest/api/browser-window#new-browserwindowoptions
  // frame: process.platform === "darwin",
  // transparent: true,
  backgroundColor,
  fullscreen: false,
  titleBarStyle: "hidden",
  frame: false,
  width: 1000,
  height: 680,
  minWidth: 1000,
  minHeight: 680
};

export default windowNormalizeOptions;
