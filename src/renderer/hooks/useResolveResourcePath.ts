import path from "path";

import { useState, useEffect } from "react";

function useResolveResourcePath(src: string): string {
  const [state, setState] = useState("");
  useEffect(() => {
    setState(path.join(window.$one.$reactiveState.get("resourcePath"), src));
  }, [src]);
  return state;
}

export default useResolveResourcePath;
