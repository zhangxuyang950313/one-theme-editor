import os from "os";
import childProcess from "child_process";
// import fse from "fs-extra";
import pathUtil from "server/utils/pathUtil";

export function compactNinePatch(
  fromDir: string,
  toDir: string
): Promise<string> {
  const { AAPT_TOOL } = pathUtil;
  if (!AAPT_TOOL) {
    throw new Error(`未知系统类型：${os.type()}`);
  }
  return new Promise((resolve, reject) => {
    const process = childProcess.execFile(
      AAPT_TOOL,
      ["c", "-S", fromDir, "-C", toDir],
      (err, stdout, stderr) => {
        if (err) reject(err);
        resolve(stdout);
      }
    );
    // process.stdout?.pipe(fse.createWriteStream(`${toDir}/log.txt`));
    process.stdout?.on("data", data => {
      console.log({ data });
    });
  });
}
