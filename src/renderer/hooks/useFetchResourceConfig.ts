import { Notification } from "@arco-design/web-react";
import { useEffect } from "react";
import { LOAD_STATUS } from "src/common/enums";
import { TypeResourceConfig } from "src/types/config.resource";
import ResourceConfigData from "src/data/ResourceConfig";
import ERR_CODE from "src/common/enums/ErrorCode";
import { useCreatePromiseHook } from "./index";
// import { ActionSetResourceConfig } from "@/store/editor/action";
// import { useEditorDispatch } from "@/store/editor";

/**
 * 获取当前工程资源配置(projectData.resourceSrc)
 * @returns
 */
export default function useFetchResourceConfig(
  resourceSrc?: string
): [
  TypeResourceConfig | undefined,
  LOAD_STATUS,
  () => Promise<TypeResourceConfig | undefined>
] {
  // const dispatch = useEditorDispatch();

  const [resourceConfig, status, doFetch] = useCreatePromiseHook(async () => {
    try {
      if (!resourceSrc) return;
      const data = await window.$one.$server.getResourceConfig(resourceSrc);
      if (!data) throw new Error(ERR_CODE[3002]);
      console.log(`加载资源配置: ${resourceSrc}`, data);
      // dispatch(ActionSetResourceConfig(data));
      return data;
    } catch (err: any) {
      Notification.error({ content: err.message });
      throw err;
    }
  }, ResourceConfigData.default);

  useEffect(() => {
    if (!resourceSrc) return;
    doFetch();
  }, [resourceSrc]);

  return [resourceConfig, status, doFetch];
}
