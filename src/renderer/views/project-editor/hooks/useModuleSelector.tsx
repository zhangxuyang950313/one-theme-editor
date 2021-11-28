import React, { ReactNode } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { TypeModuleConfig } from "src/types/config.resource";

import { projectDataState, selectDataState } from "../store/rescoil/state";

import Interface from "@/components/ModuleSelector";

export default function useModuleSelector(): {
  moduleSelected: TypeModuleConfig;
  Content: ReactNode;
} {
  const { resourceConfig } = useRecoilValue(projectDataState);
  const { moduleSelected } = useRecoilValue(selectDataState);
  const setSelectData = useSetRecoilState(selectDataState);

  return {
    moduleSelected,
    Content: (
      <Interface
        moduleSelect={moduleSelected}
        moduleList={resourceConfig.moduleList}
        onChange={moduleSelected => {
          setSelectData(state => ({ ...state, moduleSelected }));
        }}
      />
    )
  };
}
