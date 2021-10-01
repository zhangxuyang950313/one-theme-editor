import { useEffect } from "react";
import { apiGetProjectFileData } from "@/request";
import { useEditorDispatch } from "@/store";
import { ActionPatchProjectSourceData } from "@/store/editor/action";
import { FILE_EVENT } from "src/enum";
import { useFSWatcherCreator } from "../fileWatcher";
import { useProjectRoot, useProjectUUID } from "../project";
import { useResourcePageConfig } from "../resource";

/**
 * 监听当前页面所有素材
 */
export default function usePatchPageSourceData(): void {
  const uuid = useProjectUUID();
  const projectRoot = useProjectRoot();
  const pageData = useResourcePageConfig();
  const dispatch = useEditorDispatch();
  const createWatcher = useFSWatcherCreator();
  useEffect(() => {
    if (!pageData || !uuid || !projectRoot) return;
    const watcher = createWatcher({ cwd: projectRoot });
    const resourceSrcSet = new Set(
      pageData.resourceDefinitionList.map(o => o.src)
    );
    const listener = async (file: string, event: FILE_EVENT) => {
      if (!resourceSrcSet.has(file)) return;
      console.log(`监听文件变动（${event}） '${file}' `);
      switch (event) {
        case FILE_EVENT.ADD:
        case FILE_EVENT.UNLINK:
        case FILE_EVENT.CHANGE: {
          const fileData = await apiGetProjectFileData(uuid, file);
          dispatch(ActionPatchProjectSourceData(fileData));
        }
      }
    };
    watcher
      .on(FILE_EVENT.ADD, file => listener(file, FILE_EVENT.ADD))
      .on(FILE_EVENT.CHANGE, file => listener(file, FILE_EVENT.CHANGE))
      .on(FILE_EVENT.UNLINK, file => listener(file, FILE_EVENT.UNLINK))
      .add(projectRoot);
  }, [uuid, pageData, projectRoot]);

  // useProjectFileWatcher(Array.from(resourceFilepathSet), async file => {
  //   const fileData = await apiGetProjectFileData(uuid, file);
  //   dispatch(ActionPatchProjectSourceData(fileData));
  // });
}
