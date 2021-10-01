import path from "path";

import React from "react";
import styled from "styled-components";
import { useResourceConfigDir } from "@/hooks/resource/index";
import { useImagePrefix } from "@/hooks/image";

import { TypeResourceOption } from "src/types/resource";
import { LazyImage } from "../ImageCollection";

type TypeProps = {
  resourceOption: TypeResourceOption;
};

// 配置卡片
const SourceConfigCard: React.FC<TypeProps> = props => {
  const { resourceOption } = props;
  const { namespace, preview } = resourceOption;
  const imgPrefix = useImagePrefix();
  const resourceDir = useResourceConfigDir();
  const imgUrl = imgPrefix + path.join(resourceDir, namespace, preview);
  return (
    <StyleSourceConfigCard>
      <LazyImage style={{ width: "100%" }} src={imgUrl} />
      <div>{resourceOption.name}</div>
      <div>{resourceOption.uiVersion.name}</div>
    </StyleSourceConfigCard>
  );
};

const StyleSourceConfigCard = styled.div`
  cursor: pointer;
`;

export default SourceConfigCard;
