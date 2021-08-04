import React from "react";
import styled from "styled-components";

import { useSourceDefineImageList } from "@/hooks/source";
import ImageController from "@/components/ImageController/index";

const ImageSourceList: React.FC = () => {
  const sourceDefineList = useSourceDefineImageList();
  return (
    <StyleImageSourceList>
      {sourceDefineList.map((sourceDefine, key) => {
        return (
          <div className="image-controller" key={key}>
            <ImageController sourceDefine={sourceDefine} />
          </div>
        );
      })}
    </StyleImageSourceList>
  );
};

const StyleImageSourceList = styled.div`
  .image-controller {
    margin-bottom: 20px;
  }
`;

export default ImageSourceList;
