import { useState, useLayoutEffect } from "react";
import { TypeScenarioConfig } from "src/types/config.scenario";
import { LOAD_STATUS } from "src/enum";
import { useAsyncUpdater } from "./index";
import { useProjectManagerDispatch } from "@/views/project-manager/store";
import { ActionSetScenarioOptionList } from "@/views/project-manager/store/action";

/**
 * 获取配置的场景选项列表
 * @returns
 */
export default function useFetchScenarioOptionList(): {
  state: TypeScenarioConfig[];
  status: LOAD_STATUS;
  fetch: () => Promise<void>;
} {
  const [status, setStatus] = useState(LOAD_STATUS.INITIAL);
  const [state, setState] = useState<TypeScenarioConfig[]>([]);
  const dispatch = useProjectManagerDispatch();
  const registerUpdater = useAsyncUpdater();
  const fetch = async () => {
    try {
      setStatus(LOAD_STATUS.LOADING);
      const optList = await window.$server.getScenarioOptionList();
      // 去重
      const list = optList.reduce<TypeScenarioConfig[]>((t, o) => {
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
