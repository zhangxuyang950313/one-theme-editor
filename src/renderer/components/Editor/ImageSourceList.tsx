import React from "react";
import styled from "styled-components";

import ImageController from "@/components/ImageController/index";
import useImageDefinitionList from "@/hooks/resource/useImageDefinitionList";

const ImageSourceList: React.FC = () => {
  const imageDefinitionList = useImageDefinitionList();
  return (
    <StyleImageController>
      {imageDefinitionList.map((item, key) => (
        <ImageController key={key} className="item" imageDefinition={item} />
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
