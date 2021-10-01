import React from "react";
import styled from "styled-components";

import ImageController from "@/components/ImageController/index";
import useSourceImageDefinedList from "@/hooks/source/useSourceImageDefinedList";

const ImageSourceList: React.FC = () => {
  const imageDefineList = useSourceImageDefinedList();
  return (
    <StyleImageController>
      {imageDefineList.map((sourceDefine, key) => (
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
