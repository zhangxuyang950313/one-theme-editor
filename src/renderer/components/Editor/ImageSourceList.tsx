import React from "react";
import styled from "styled-components";

import { useSourceDefineImageList } from "@/hooks/source";
import ImageController from "@/components/ImageController/index";

const ImageSourceList: React.FC = () => {
  const sourceDefineList = useSourceDefineImageList();
  return (
    <StyleImageController>
      {sourceDefineList.map((sourceDefine, key) => (
        <ImageController
          key={key}
          className="item"
          sourceDefine={sourceDefine}
        />
      ))}
    </StyleImageController>
  );
};

const StyleImageController = styled.div`
  .item {
    margin-bottom: 20px;
  }
`;

export default ImageSourceList;
