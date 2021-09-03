import React from "react";
import styled from "styled-components";

import { useSourceDefineImageList } from "@/hooks/source";
import ImageController from "@/components/ImageController/index";

const ImageSourceList: React.FC = () => {
  const sourceDefineList = useSourceDefineImageList();
  return (
    <>
      {sourceDefineList.map((sourceDefine, key) => (
        <StyleImageController key={key} sourceDefine={sourceDefine} />
      ))}
    </>
  );
};

const StyleImageController = styled(ImageController)`
  margin-bottom: 20px;
`;

export default ImageSourceList;
