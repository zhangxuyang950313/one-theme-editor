import React from "react";

type TypeContext = {
  releaseList: string[];
  dynamicToList: string[];
};

export default React.createContext<TypeContext>({
  releaseList: [],
  dynamicToList: []
});
