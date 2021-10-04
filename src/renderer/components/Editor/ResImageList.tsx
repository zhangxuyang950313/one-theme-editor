import React from "react";

import ImageHandler from "@/components/ImageHandler/index";
import useImageDefinitionList from "@/hooks/resource/useImageDefinitionList";

const ResImageList: React.FC = () => {
  const imageDefinitionList = useImageDefinitionList();
  return (
    <>
      {imageDefinitionList.map((item, key) => (
        <ImageHandler key={key} imageDefinition={item} />
      ))}
    </>
  );
};

export default ResImageList;
