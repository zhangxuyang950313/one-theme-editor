import React from "react";
import styled from "styled-components";

import ImageController from "@/components/ImageController/index";
import useImageDefinedList from "@/hooks/resource/useImageDefinedList";

const ImageSourceList: React.FC = () => {
  const imageDefinedList = useImageDefinedList();
  return (
    <StyleImageController>
      {imageDefinedList.map((item, key) => (
        <ImageController key={key} className="item" imageDefine={item} />
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
