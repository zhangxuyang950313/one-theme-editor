import { useCallback, useLayoutEffect, useState } from "react";
import { useStarterDispatch } from "@/store/starter";
import { ActionSetProjectList } from "@/store/starter/action";
import { TypeProjectDataDoc } from "src/types/project";
import { LOAD_STATUS } from "src/enum";
import { useScenarioOption } from "../resource";

// 获取项目列表
export default function useFetchProjectList(): {
  data: TypeProjectDataDoc[];
  status: LOAD_STATUS;
  fetch: () => Promise<void>;
} {
  // 使用机型隔离查询
  const [scenarioOption] = useScenarioOption();
  const [projectList, setProjectList] = useState<TypeProjectDataDoc[]>([]);
  const [status, setStatus] = useState<LOAD_STATUS>(LOAD_STATUS.INITIAL);
  const dispatch = useStarterDispatch();

  const fetch = useCallback(async () => {
    if (!scenarioOption.md5) return;
    setStatus(LOAD_STATUS.LOADING);
    setProjectList([]);
    // await sleep(300);
    window.$server
      .getProjectListByMd5(scenarioOption.md5)
      .then(projects => {
        console.log("工程列表", projects);
        setProjectList(projects);
        dispatch(ActionSetProjectList(projects));
        setStatus(LOAD_STATUS.SUCCESS);
      })
      .catch(() => {
        setStatus(LOAD_STATUS.FAILED);
      });
  }, [scenarioOption]);

  useLayoutEffect(() => {
    fetch();
  }, [scenarioOption.md5]);
  return { data: projectList, status, fetch };
}
