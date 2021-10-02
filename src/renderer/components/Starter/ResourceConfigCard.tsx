import path from "path";

import React from "react";
import styled from "styled-components";
import { useResConfigDir } from "@/hooks/resource/index";
import { useImagePrefix } from "@/hooks/image";

import { TypeResourceOption } from "src/types/resource";
import { LazyImage } from "../ImageCollection";

type TypeProps = {
  resourceOption: TypeResourceOption;
};

// 配置卡片
const ResourceConfigCard: React.FC<TypeProps> = props => {
  const { resourceOption } = props;
  const { namespace, preview } = resourceOption;
  const imgPrefix = useImagePrefix();
  const resourceDir = useResConfigDir();
  const imgUrl = imgPrefix + path.join(resourceDir, namespace, preview);
  return (
    <StyleResourceConfigCard>
      <LazyImage style={{ width: "100%" }} src={imgUrl} />
      <div>{resourceOption.name}</div>
      <div>{resourceOption.uiVersion.name}</div>
    </StyleResourceConfigCard>
  );
};

const StyleResourceConfigCard = styled.div`
  cursor: pointer;
`;

export default ResourceConfigCard;
