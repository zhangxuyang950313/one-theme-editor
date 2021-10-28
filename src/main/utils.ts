import * as electronStore from "src/store";
import {
  app,
  BrowserWindow,
  Display,
  Point,
  Rectangle,
  screen
} from "electron";

// 保存当前聚焦窗口的屏幕中心坐标
export async function saveCurrentDisplayCenter(): Promise<void> {
  // 取当前屏幕中心点，用于创建屏幕计算在屏幕位置，适用于多显示器
  const rect = BrowserWindow.getFocusedWindow()?.getContentBounds() || {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  const display = await getDisplayMatching(rect);
  const center = getDisplayWorkAreaCenterPoint(display);
  electronStore.config.set("screenCenter", center);
}

export function moveWindowToCenter(win: BrowserWindow): void {
  const { x, y } = electronStore.config.get("screenCenter") || {};
  const [width, height] = win.getSize();
  if (x && width && y && height) {
    win.setPosition(
      Math.floor(x - width / 2),
      Math.floor(y - height / 2),
      false
    );
  }
}

// 获取矩形最近的屏幕
export async function getDisplayMatching(rect: Rectangle): Promise<Display> {
  await new Promise<void>(resolve => {
    if (app.isReady()) resolve();
    app.on("ready", () => resolve());
  });
  return screen.getDisplayMatching(rect);
}

// 获取屏幕中心点
export function getDisplayWorkAreaCenterPoint(display: Display): Point {
  const { x, y, width, height } = display.workArea;
  return { x: x + width / 2, y: y + height / 2 };
}
