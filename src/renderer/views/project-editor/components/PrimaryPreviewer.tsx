import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { selectDataState } from "../store/rescoil/state";

import Interface from "@/components/Previewer";

// 大预览图
const PrimaryPreviewer: React.FC = () => {
  const { pageSelected } = useRecoilValue(selectDataState);

  return (
    <StylePrimaryPreviewer>
      <Interface pageConfig={pageSelected} mouseEffect />
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
