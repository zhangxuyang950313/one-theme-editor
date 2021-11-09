import { useState } from "react";
import { FILE_EVENT } from "src/common/enums";
import { FileData } from "src/data/ResourceConfig";
import { TypeFileData } from "src/types/file-data";
import { useSubscribeProjectFile } from "@/views/project-editor/hooks";

// 监听文件变化，返回动态的 url state fileData
function useProjectFile(src: string): {
  url: string;
  state: FILE_EVENT;
  fileData: TypeFileData;
} {
  const [url, setUrl] = useState(`project://${src}`);
  const [state, setState] = useState(FILE_EVENT.UNLINK);
  const [fileData, setFileData] = useState(FileData.default);

  useSubscribeProjectFile(src, (event, file, fileData) => {
    setState(event);
    setFileData(fileData);
    const u = new URL(url);
    u.searchParams.set("t", Date.now().toString());
    setUrl(u.toString());
  });

  return { url, state, fileData };
}

export default useProjectFile;
