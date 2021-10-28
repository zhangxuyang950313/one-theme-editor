import { useEffect } from "react";
import { apiGetProjectFileData } from "@/request";
import { useEditorDispatch } from "@/store/editor";
import { FILE_EVENT } from "src/enum";
import { useFSWatcherCreator } from "../fileWatcher";
import { useProjectRoot } from "../project";
import { useCurrentPageConfig } from "../resource";

/**
 * @deprecated
 * 监听当前页面所有素材
 */
export default function usePatchPageSourceData(): void {
  const projectRoot = useProjectRoot();
  const pageData = useCurrentPageConfig();
  const dispatch = useEditorDispatch();
  const createWatcher = useFSWatcherCreator();
  useEffect(() => {
    if (!pageData || !projectRoot) return;
    const watcher = createWatcher({ cwd: projectRoot });
    const resourceSrcSet = new Set(
      [""]
      // Object.entries(pageData.resourceMapper).reduce((prev,[,resourceList]) => {
      //   resourceList.forEach(resource =>resource.items.)
      // },[])
    );
    const listener = async (file: string, event: FILE_EVENT) => {
      if (!resourceSrcSet.has(file)) return;
      console.log(`监听文件变动（${event}） '${file}' `);
      switch (event) {
        case FILE_EVENT.ADD:
        case FILE_EVENT.CHANGE: {
          const fileData = await apiGetProjectFileData(file);
          // dispatch(ActionPatchFileData(fileData));
          break;
        }
        case FILE_EVENT.UNLINK: {
          // dispatch(ActionRemoveFileData(file));
          break;
        }
      }
    };
    watcher
      .on(FILE_EVENT.ADD, file => listener(file, FILE_EVENT.ADD))
      .on(FILE_EVENT.CHANGE, file => listener(file, FILE_EVENT.CHANGE))
      .on(FILE_EVENT.UNLINK, file => listener(file, FILE_EVENT.UNLINK))
      .add(projectRoot);
  }, [pageData, projectRoot]);

  // useProjectFileWatcher(Array.from(resourceFilepathSet), async file => {
  //   const fileData = await apiGetProjectFileData(uuid, file);
  //   dispatch(ActionPatchProjectSourceData(fileData));
  // });
}
