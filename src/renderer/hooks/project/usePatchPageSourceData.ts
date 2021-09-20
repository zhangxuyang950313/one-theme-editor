import { useEffect } from "react";
import { apiGetProjectFileData } from "@/request";
import { useEditorDispatch } from "@/store";
import { ActionPatchProjectSourceData } from "@/store/editor/action";
import { FILE_STATUS } from "src/enum";
import { useFSWatcherCreator } from "../fileWatcher";
import { useProjectRoot, useProjectUUID } from "../project";
import { useSourcePageData } from "../source";

/**
 * 监听当前页面所有素材
 */
export default function usePatchPageSourceData(): void {
  const uuid = useProjectUUID();
  const projectRoot = useProjectRoot();
  const pageData = useSourcePageData();
  const dispatch = useEditorDispatch();
  const createWatcher = useFSWatcherCreator();
  useEffect(() => {
    if (!pageData || !uuid || !projectRoot) return;
    const watcher = createWatcher({ cwd: projectRoot });
    const sourceSrcSet = new Set(pageData.sourceDefineList.map(o => o.src));
    const listener = async (file: string, event: FILE_STATUS) => {
      if (!sourceSrcSet.has(file)) return;
      console.log(`监听文件变动（${event}） '${file}' `);
      switch (event) {
        case FILE_STATUS.ADD:
        case FILE_STATUS.UNLINK:
        case FILE_STATUS.CHANGE: {
          const fileData = await apiGetProjectFileData(uuid, file);
          dispatch(ActionPatchProjectSourceData(fileData));
        }
      }
    };
    watcher
      .on(FILE_STATUS.ADD, file => listener(file, FILE_STATUS.ADD))
      .on(FILE_STATUS.CHANGE, file => listener(file, FILE_STATUS.CHANGE))
      .on(FILE_STATUS.UNLINK, file => listener(file, FILE_STATUS.UNLINK))
      .add(projectRoot);
    return () => {
      if (!watcher) return;
      const watcherList = watcher.getWatched();
      watcher.close().then(() => {
        console.log("关闭文件监听", watcherList);
      });
    };
  }, [uuid, pageData, projectRoot]);

  // useProjectFileWatcher(Array.from(sourceFilepathSet), async file => {
  //   const fileData = await apiGetProjectFileData(uuid, file);
  //   dispatch(ActionPatchProjectSourceData(fileData));
  // });
}
