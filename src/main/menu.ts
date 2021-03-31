import { app } from "electron";

const template = [
  {
    label: "菜单",
    submenu: [
      {
        label: `版本：${app.getVersion()}`
      },
      {
        label: "退出",
        accelerator: "CmdOrCtrl+Q",
        click(): void {
          app.quit();
        }
      }
    ]
  }
];
export default template;
