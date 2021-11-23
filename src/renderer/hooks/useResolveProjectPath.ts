import path from "path";

import { useState, useEffect } from "react";

function useResolveProjectPath(src: string): string {
  const [state, setState] = useState("");
  useEffect(() => {
    setState(path.join(window.$one.$reactive.get("projectPath"), src));
  }, [src]);
  return state;
}

export default useResolveProjectPath;
