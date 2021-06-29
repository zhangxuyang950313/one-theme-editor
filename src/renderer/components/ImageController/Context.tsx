import React from "react";

type TypeContext = {
  toList: string[];
  dynamicToList: string[];
};

export default React.createContext<TypeContext>({
  toList: [],
  dynamicToList: []
});
