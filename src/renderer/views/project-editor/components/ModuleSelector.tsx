import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { projectDataState, selectDataState } from "../store/rescoil/state";

import Interface from "@/components/ModuleSelector";

const ModuleSelector: React.FC = () => {
  const { resourceConfig } = useRecoilValue(projectDataState);
  const { moduleSelected } = useRecoilValue(selectDataState);
  const setSelectData = useSetRecoilState(selectDataState);

  return (
    <Interface
      moduleSelect={moduleSelected}
      moduleList={resourceConfig.moduleList}
      onChange={moduleSelected => {
        setSelectData(state => ({ ...state, moduleSelected }));
      }}
    />
  );
};
export default ModuleSelector;
