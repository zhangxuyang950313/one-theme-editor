import { useState, useLayoutEffect } from "react";
import { message } from "antd";
import { apiGetSourceOptionList } from "@/request";
import { useStarterDispatch } from "@/store";
import { ActionSetSourceOptionList } from "@/store/starter/action";
import { LOAD_STATUS } from "src/enum";
import { TypeSourceOption } from "src/types/source";
import { sleep } from "src/utils";
import ERR_CODE from "src/common/errorCode";
import { useScenarioOption } from ".";

/**
 * 获取编辑器列表
 * @returns
 */
export default function useFetchSourceOptionList(): {
  state: TypeSourceOption[];
  status: LOAD_STATUS;
  fetch: () => Promise<void>;
} {
  const [state, setState] = useState<TypeSourceOption[]>([]);
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [currentScenarioOption] = useScenarioOption();
  const dispatch = useStarterDispatch();
  const fetch = async () => {
    if (!currentScenarioOption.src) return;
    setStatus(LOAD_STATUS.LOADING);
    await sleep(300);
    apiGetSourceOptionList(currentScenarioOption.src)
      .then(data => {
        console.log("配置列表：", data);
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
