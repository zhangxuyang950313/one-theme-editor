import { useLayoutEffect, useState } from "react";
import { FILE_EVENT, PROTOCOL_TYPE } from "src/common/enums";
import { FileData } from "src/data/ResourceConfig";
import { TypeFileData } from "src/types/file-data";
import { useSubscribeSrc } from "@/views/project-editor/hooks";

// 监听文件变化，返回动态的 url state fileData
function useSubscribedSrc(
  src: string,
  options?: {
    // 双向输出
    isBothWay?: boolean;
    // 过滤器
    filter?: (
      event: FILE_EVENT,
      file: string,
      fileData: TypeFileData
    ) => boolean;
  }
): {
  url: string;
  state: FILE_EVENT;
  fileData: TypeFileData;
} {
  const protocol = options?.isBothWay
    ? PROTOCOL_TYPE.src
    : PROTOCOL_TYPE.project;
  const [url, setUrl] = useState(`${protocol}://${src}`);
  const [state, setState] = useState(FILE_EVENT.UNLINK);
  const [fileData, setFileData] = useState(FileData.default);
  const subscribe = useSubscribeSrc({ immediately: true });

  useLayoutEffect(() => {
    if (!src) return;
    subscribe(src, (event, file, fileData) => {
      if (options?.filter && options.filter(event, file, fileData)) {
        return;
      }
      setState(event);
      setFileData(fileData);
      const u = new URL(url);
      u.searchParams.set("t", Date.now().toString());
      setUrl(u.toString());
    });
  }, [src]);

  return { url, state, fileData };
}

export default useSubscribedSrc;
