// import shell from "shelljs";
import ChildProcess from "child_process";

export function compactNinePatch() {
  return ChildProcess.exec("git branch --show-current");
}
