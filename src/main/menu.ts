/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BrowserWindow, MenuItemConstructorOptions } from "electron";

const template: MenuItemConstructorOptions[] = [
  {
    label: "文件",
    submenu: [
      {
        label: "新建",
        accelerator: "CmdOrCtrl+N",
        click: (item, focusedWindow): void => {
          if (!focusedWindow) return;
          focusedWindow.webContents.send("action", "new");
        }
      },
      {
        label: "打开",
        accelerator: "CmdOrCtrl+O",
        click: (item, focusedWindow): void => {
          if (!focusedWindow) return;
          focusedWindow.webContents.send("action", "open");
        }
      },
      {
        label: "保存",
        accelerator: "CmdOrCtrl+S",
        click: (item, focusedWindow): void => {
          if (!focusedWindow) return;
          focusedWindow.webContents.send("action", "save");
        }
      },
      {
        label: "另存为",
        accelerator: "Shift+CmdOrCtrl+S",
        click: (item, focusedWindow): void => {
          if (!focusedWindow) return;
          focusedWindow.webContents.send("action", "save");
        }
      },
      {
        label: "应用到手机",
        accelerator: "CmdOrCtrl+A",
        click: (item, focusedWindow): void => {
          if (!focusedWindow) return;
          focusedWindow.webContents.send("action", "apply");
        }
      }
    ]
  },
  {
    label: "工具",
    submenu: [
      {
        label: "开发者调试工具",
        accelerator: "Alt+CmdOrCtrl+I",
        click: (item, focusedWindow): void => {
          if (!focusedWindow) return;
          focusedWindow.webContents.openDevTools({
            mode: "right"
          });
        }
      },
      {
        label: "重载",
        accelerator: "CmdOrCtrl+R",
        click: (item, focusedWindow): void => {
          if (focusedWindow) {
            // 重载之后, 刷新并关闭所有的次要窗体
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(function (win) {
                if (win.id > 1) {
                  win.close();
                }
              });
            }
            focusedWindow.reload();
            if (process.env.WEBPACK_DEV_SERVER_URL) {
              focusedWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
            } else {
              focusedWindow.loadURL("app://./index.html");
            }
          }
        }
      }
    ]
  }
];

export default template;
