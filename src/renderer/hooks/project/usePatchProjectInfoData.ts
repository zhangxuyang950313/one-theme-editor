import { useEffect } from "react";
import { apiGetProjectFileData, apiUpdateProject } from "@/request";
import { useEditorDispatch } from "@/store";
import { ActionPatchProjectSourceData } from "@/store/editor/action";
import { FILE_STATUS } from "src/enum";
import { ProjectInfo } from "src/data/ProjectData";
import { useFSWatcherCreator } from "../fileWatcher";
import {
  useProjectInfoConfig,
  useProjectRoot,
  useProjectUUID
} from "../project";

/**
 * 监听当前 infoTemplate 目标文件
 */
export default function usePatchProjectInfoData(): void {
  const uuid = useProjectUUID();
  const projectInfoConfig = useProjectInfoConfig();
  const projectRoot = useProjectRoot();
  const projectUUID = useProjectUUID();
  const dispatch = useEditorDispatch();
  const createWatcher = useFSWatcherCreator();
  useEffect(() => {
    if (!uuid || !projectRoot) return;
    const watcher = createWatcher({ cwd: projectRoot });
    const listener = async (file: string, event: FILE_STATUS) => {
      console.log(`监听文件变动（${event}） '${file}' `);
      switch (event) {
        case FILE_STATUS.ADD:
        case FILE_STATUS.UNLINK:
        case FILE_STATUS.CHANGE: {
          const fileData = await apiGetProjectFileData(uuid, file);
          dispatch(ActionPatchProjectSourceData(fileData));
          // const projectInfo = new ProjectInfo().set("name");
          // apiUpdateProject({ uuid: projectUUID, projectInfo });
        }
      }
    };
    watcher
      .on(FILE_STATUS.ADD, file => listener(file, FILE_STATUS.ADD))
      .on(FILE_STATUS.CHANGE, file => listener(file, FILE_STATUS.CHANGE))
      .on(FILE_STATUS.UNLINK, file => listener(file, FILE_STATUS.UNLINK))
      .add(projectInfoConfig.output);
    return () => {
      if (!watcher) return;
      const watcherList = watcher.getWatched();
      watcher.close().then(() => {
        console.log("关闭文件监听", watcherList);
      });
    };
  }, [uuid, projectInfoConfig.output]);
}
