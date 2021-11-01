import { useEffect } from "react";
import { Notification } from "@arco-design/web-react";
import { LOAD_STATUS } from "src/enum";
import { TypeProjectDataDoc } from "src/types/project";
import ERR_CODE from "src/common/errorCode";
import ProjectData from "src/data/ProjectData";
import { useCreatePromiseHook } from "../index";

/**
 * 加载工程
 * @param uuid
 * @returns
 */
export default function useFetchProjectData(
  uuid: string
): [TypeProjectDataDoc, LOAD_STATUS, () => Promise<TypeProjectDataDoc>] {
  // const dispatch = useEditorDispatch();

  const [projectData, status, doFetch] = useCreatePromiseHook(async () => {
    try {
      const project = await window.$server.getProjectDataByUUID(uuid);
      if (!project) throw new Error(ERR_CODE[2005]);
      console.log(`载入工程: ${uuid}`, project);
      // dispatch(ActionSetProjectData(project));
      return project;
    } catch (err: any) {
      Notification.error({ content: err.message });
      // dispatch(ActionInitEditor());
      return ProjectData.default;
    }
  }, ProjectData.default);

  useEffect(() => {
    if (!uuid) return;
    doFetch();
  }, [uuid]);

  return [projectData, status, doFetch];
}
