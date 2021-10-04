import React from "react";

import ImageHandler from "@/components/ImageHandler/index";
import { useResDefinitionList } from "@/hooks/resource";
import { FILE_TYPE } from "src/enum";

const ResImageList: React.FC = () => {
  const resourceList = useResDefinitionList();
  const imageResourceList = resourceList.flatMap(item =>
    item.fileType === FILE_TYPE.IMAGE ? item : []
  );
  return (
    <>
      {imageResourceList.map((item, key) => (
        <ImageHandler key={key} imageDefinition={item} />
      ))}
    </>
  );
};

export default ResImageList;
