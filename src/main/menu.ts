import { app } from "electron";

const template = [
  {
    label: "菜单",
    submenu: [
      {
        label: app.getName()
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
