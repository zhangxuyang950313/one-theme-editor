import { useEffect } from "react";
import { FILE_EVENT } from "src/enum";
import { useFSWatcherCreator } from "../fileWatcher";
import { useProjectRoot } from "./index";

export default function useWatchProjectFile(
  listener: (file: string, status: FILE_EVENT) => void
): void {
  const projectRoot = useProjectRoot();
  const createWatcher = useFSWatcherCreator();
  useEffect(() => {
    if (!projectRoot) return;
    const watcher = createWatcher({ cwd: projectRoot });
    watcher
      .on(FILE_EVENT.ADD, file => listener(file, FILE_EVENT.ADD))
      .on(FILE_EVENT.UNLINK, file => listener(file, FILE_EVENT.UNLINK))
      .on(FILE_EVENT.CHANGE, file => listener(file, FILE_EVENT.CHANGE))
      .add(".");
  }, [projectRoot]);
}
