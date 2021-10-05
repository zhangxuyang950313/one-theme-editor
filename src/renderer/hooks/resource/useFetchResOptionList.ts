import { useState, useLayoutEffect } from "react";
import { message } from "antd";
import { apiGetResOptionList } from "@/request";
import { useStarterDispatch } from "@/store";
import { ActionSetSourceOptionList } from "@/store/starter/action";
import { LOAD_STATUS } from "src/enum";
import { TypeResourceOption } from "src/types/resource";
import ERR_CODE from "src/constant/errorCode";
import { useScenarioOption } from ".";

/**
 * 获取编辑器资源选项列表列表
 * @returns
 */
export default function useFetchResOptionList(): {
  state: TypeResourceOption[];
  status: LOAD_STATUS;
  fetch: () => Promise<void>;
} {
  const [state, setState] = useState<TypeResourceOption[]>([]);
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [currentScenarioOption] = useScenarioOption();
  const dispatch = useStarterDispatch();
  const fetch = async () => {
    if (!currentScenarioOption.src) return;
    setStatus(LOAD_STATUS.LOADING);
    // await sleep(300);
    apiGetResOptionList(currentScenarioOption.src)
      .then(data => {
        console.log("配置列表", data);
        setState(data);
        dispatch(ActionSetSourceOptionList(data));
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
  }, [currentScenarioOption]);
  return { state, status, fetch };
}
