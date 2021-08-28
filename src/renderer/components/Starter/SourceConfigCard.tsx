import path from "path";

import React from "react";
import styled from "styled-components";
import { useSourceConfigDir } from "@/hooks/source";
import { useImagePrefix } from "@/hooks/image";

import { TypeSourceConfigInfo } from "src/types/source";
import { LazyImage } from "../ImageCollection";

type TypeProps = {
  sourceDescription: TypeSourceConfigInfo;
};

// 配置卡片
const SourceConfigCard: React.FC<TypeProps> = props => {
  const { sourceDescription } = props;
  const { root, preview } = sourceDescription;
  const imgPrefix = useImagePrefix();
  const sourceDir = useSourceConfigDir();
  const imgUrl = imgPrefix + path.join(sourceDir, root, preview);
  return (
    <StyleSourceConfigCard>
      <LazyImage style={{ width: "100%" }} src={imgUrl} />
      <div>{sourceDescription.name}</div>
      <div>{sourceDescription.uiVersion.name}</div>
    </StyleSourceConfigCard>
  );
};

const StyleSourceConfigCard = styled.div`
  cursor: pointer;
`;

export default SourceConfigCard;
