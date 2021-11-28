import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import { selectDataState } from "../store/rescoil/state";

import Interface from "@/components/Previewer";

// 大预览图
const PrimaryPreviewer: React.FC = () => {
  const { pageSelected, focusKeyPath } = useRecoilValue(selectDataState);
  const setSelectData = useSetRecoilState(selectDataState);

  return (
    <StylePrimaryPreviewer>
      <Interface
        mouseEffect
        pageConfig={pageSelected}
        focusKeyPath={focusKeyPath}
        onSelect={keyPath => {
          setSelectData(state => ({
            ...state,
            focusKeyPath: keyPath
          }));
        }}
      />
      <div className="page-name">{pageSelected.name}</div>
    </StylePrimaryPreviewer>
  );
};

const StylePrimaryPreviewer = styled.div`
  width: 100%;
  height: 100%;
  .page-name {
    margin: 10px;
    text-align: center;
    color: var(--color-text-1);
  }
`;

export default PrimaryPreviewer;
