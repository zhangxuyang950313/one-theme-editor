import { remote } from "electron";
/**
 * 点击原始素材，mac 支持小窗预览
 * @param filepath
 * @param name
 */
export const previewFile = (filepath: string, name: string): void => {
  if (process.platform !== "darwin") return;
  remote.getCurrentWindow().previewFile(filepath, name);
};
