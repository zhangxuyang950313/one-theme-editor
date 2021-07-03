import React from "react";
import styled from "styled-components";

import { useImageSourceList } from "@/hooks/sourceConfig";
import ImageController from "@/components/ImageController/index";

const ImageSourceList: React.FC = () => {
  const imageSourceList = useImageSourceList();

  return (
    <StyleImageSourceList>
      {imageSourceList.map((sourceConf, key) => (
        <ImageController key={key} {...sourceConf} />
      ))}
    </StyleImageSourceList>
  );
};

const StyleImageSourceList = styled.div``;

export default ImageSourceList;
