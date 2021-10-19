import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { notification } from "antd";
import { useEditorDispatch, useEditorSelector } from "@/store";
import { LOAD_STATUS } from "src/enum";
import { TypeProjectDataDoc } from "src/types/project";
import { apiGetProjectByUUID } from "@/request";
import { ActionInitEditor, ActionSetProjectData } from "@/store/editor/action";
import ERR_CODE from "src/constant/errorCode";

/**
 * 加载工程
 * @param uuid
 * @returns
 */
export default function useFetchProjectData(): [
  TypeProjectDataDoc,
  LOAD_STATUS,
  () => Promise<void>
] {
  // 从路由参数中获得工程 uuid
  const { uuid } = useParams<{ uuid: string }>();
  const dispatch = useEditorDispatch();
  const projectData = useEditorSelector(state => state.projectData);
  const [status, setStatus] = useState<LOAD_STATUS>(LOAD_STATUS.INITIAL);
  const handleFetch = async () => {
    setStatus(LOAD_STATUS.LOADING);
    // await sleep(300);
    return window.$server
      .getProject(uuid)
      .then(project => {
        console.log(project);
        if (!project) throw new Error(ERR_CODE[2005]);
        console.log(`载入工程: ${uuid}`, project);
        dispatch(ActionSetProjectData(project));
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(err => {
        notification.error({ message: err.message });
        dispatch(ActionInitEditor());
        setStatus(LOAD_STATUS.FAILED);
      });
  };
  useEffect(() => {
    handleFetch();
  }, [uuid]);
  return [projectData, status, handleFetch];
}
