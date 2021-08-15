import os from "os";
import childProcess from "child_process";
import pathUtil from "server/utils/pathUtil";

export function compactNinePatch(
  fromDir: string,
  toDir: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!pathUtil.AAPT_TOOL) {
      throw new Error(`未知系统类型：${os.type()}`);
    }
    childProcess.execFile(
      pathUtil.AAPT_TOOL,
      ["c", "-S", fromDir, "-C", toDir],
      (err, stdout, stderr) => {
        if (err) reject(err);
        resolve(stdout);
      }
    );
  });
}
