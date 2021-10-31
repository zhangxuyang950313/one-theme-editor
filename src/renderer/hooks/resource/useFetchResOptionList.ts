import { useState, useLayoutEffect } from "react";
import { message } from "antd";
import { useStarterDispatch } from "@/store/starter";
import { ActionSetResourceOptionList } from "@/store/starter/action";
import { LOAD_STATUS } from "src/enum";
import { TypeResourceOption } from "src/types/resource.config";
import ERR_CODE from "src/constant/errorCode";

/**
 * 获取编辑器资源选项列表列表
 * @returns
 */
export default function useFetchResOptionList(scenarioSrc: string): {
  state: TypeResourceOption[];
  status: LOAD_STATUS;
  fetch: () => Promise<void>;
} {
  const [state, setState] = useState<TypeResourceOption[]>([]);
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const dispatch = useStarterDispatch();
  const fetch = async () => {
    if (!scenarioSrc) return;
    setStatus(LOAD_STATUS.LOADING);
    // await sleep(300);
    window.$server
      .getResourceOptionList(scenarioSrc)
      .then(data => {
        console.log("配置列表", data);
        setState(data);
        dispatch(ActionSetResourceOptionList(data));
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(err => {
        const content = ERR_CODE[3002];
        message.error({ content });
        console.log(`${content}: ${err}`);
        setStatus(LOAD_STATUS.FAILED);
      });
  };
  useLayoutEffect(() => {
    fetch();
  }, [scenarioSrc]);
  return { state, status, fetch };
}
