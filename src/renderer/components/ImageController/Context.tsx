import React from "react";

type TypeContext = {
  releaseList: string[];
  dynamicReleaseList: string[];
};

export default React.createContext<TypeContext>({
  releaseList: [],
  dynamicReleaseList: []
});
