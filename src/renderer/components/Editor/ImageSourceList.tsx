import React from "react";

import { useImageSourceList } from "@/hooks/source";
import ImageController from "@/components/ImageController/index";

const ImageSourceList: React.FC = () => {
  const imageSourceList = useImageSourceList();
  // console.log({ imageSourceList });
  return (
    <>
      {imageSourceList.map((sourceConf, key) => (
        <ImageController key={key} {...sourceConf} />
      ))}
    </>
  );
};

export default ImageSourceList;
