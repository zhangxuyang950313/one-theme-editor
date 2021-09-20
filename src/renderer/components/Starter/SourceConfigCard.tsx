import path from "path";

import React from "react";
import styled from "styled-components";
import { useSourceConfigDir } from "@/hooks/source/index";
import { useImagePrefix } from "@/hooks/image";

import { TypeSourceOption } from "src/types/source";
import { LazyImage } from "../ImageCollection";

type TypeProps = {
  sourceConfigPreview: TypeSourceOption;
};

// 配置卡片
const SourceConfigCard: React.FC<TypeProps> = props => {
  const { sourceConfigPreview } = props;
  const { namespace, preview } = sourceConfigPreview;
  const imgPrefix = useImagePrefix();
  const sourceDir = useSourceConfigDir();
  const imgUrl = imgPrefix + path.join(sourceDir, namespace, preview);
  return (
    <StyleSourceConfigCard>
      <LazyImage style={{ width: "100%" }} src={imgUrl} />
      <div>{sourceConfigPreview.name}</div>
      <div>{sourceConfigPreview.uiVersion.name}</div>
    </StyleSourceConfigCard>
  );
};

const StyleSourceConfigCard = styled.div`
  cursor: pointer;
`;

export default SourceConfigCard;
