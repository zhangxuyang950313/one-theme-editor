import React from "react";

import { useDefineImageList } from "@/hooks/source";
import ImageController from "@/components/ImageController/index";

const ImageSourceList: React.FC = () => {
  const imageSourceList = useDefineImageList();
  return (
    <>
      {imageSourceList.map((sourceConf, key) => (
        <ImageController key={key} {...sourceConf} />
      ))}
    </>
  );
};

export default ImageSourceList;
