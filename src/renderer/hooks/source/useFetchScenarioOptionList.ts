import { useState, useLayoutEffect } from "react";
import { apiGetScenarioOptionList } from "@/request";
import { useStarterDispatch } from "@/store";
import { ActionSetScenarioOptionList } from "@/store/starter/action";
import { TypeScenarioOption } from "src/types/source";
import { LOAD_STATUS } from "src/enum";
import { useAsyncUpdater } from "..";

/**
 * 获取配置的场景列表
 * @returns
 */
export default function useFetchScenarioOptionList(): {
  state: TypeScenarioOption[];
  status: LOAD_STATUS;
  fetch: () => Promise<void>;
} {
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [state, setState] = useState<TypeScenarioOption[]>([]);
  const dispatch = useStarterDispatch();
  const registerUpdater = useAsyncUpdater();
  const fetch = async () => {
    try {
      setStatus(LOAD_STATUS.LOADING);
      const optList = await apiGetScenarioOptionList();
      // 去重
      const list = optList.reduce<TypeScenarioOption[]>((t, o) => {
        if (!t.some(item => item.md5 === o.md5)) t.push(o);
        return t;
      }, []);
      console.log("工程类型列表", list);
      registerUpdater(() => {
        setState(list);
        dispatch(ActionSetScenarioOptionList(list));
        setStatus(LOAD_STATUS.SUCCESS);
      });
    } catch (e) {
      setStatus(LOAD_STATUS.FAILED);
    }
  };
  useLayoutEffect(() => {
    fetch();
  }, []);
  return { state, status, fetch };
}