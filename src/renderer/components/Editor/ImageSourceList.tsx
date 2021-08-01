import React from "react";
import styled from "styled-components";

import { useSourceDefineImageList } from "@/hooks/source";
import ImageController from "@/components/ImageController/index";
import { useProjectImageFileDataMap } from "@/hooks/project";

const ImageSourceList: React.FC = () => {
  const sourceDefineList = useSourceDefineImageList();
  const imageFileDataMap = useProjectImageFileDataMap();
  return (
    <StyleImageSourceList>
      {sourceDefineList.map((sourceDefine, key) => {
        const urlValue = imageFileDataMap.get(sourceDefine.src)?.url || "";
        return (
          <div className="image-controller" key={key}>
            <ImageController
              urlValue={urlValue}
              sourceDefineImage={sourceDefine}
              onChange={value => {
                console.log({ value });
              }}
            />
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
