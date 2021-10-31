import path from "path";
import fse from "fs-extra";
import { useEffect } from "react";
import { useEditorDispatch } from "@/store/editor";
import { ActionPatchFileDataMap } from "@/store/editor/action";
import { FILE_EVENT } from "src/enum";
import { TypeFileData } from "src/types/resource.page";
import { FileData } from "src/data/ResourceConfig";
import { useProjectRoot } from "./index";

const fileDataMap = new Map<string, { mtime: Date; data: TypeFileData }>();

const getFileDataWithCache = (file: string) => {
  // 不存在返回默认数据对象
  if (!fse.existsSync(file)) {
    fileDataMap.delete(file);
    return FileData.default;
  }

  // 根据最后修改时间进行协商缓存
  const { mtime } = fse.statSync(file);
  const cache = fileDataMap.get(file);
  if (cache && cache.mtime >= mtime) {
    console.log("获取 fileData 读取缓存", file);
    return cache.data;
  }

  // 获取 fileData
  const fileData = window.$server.getFileDataSync(file);
  switch (fileData.fileType) {
    case "image/png":
    case "image/jpeg":
    case "application/xml": {
      fileDataMap.set(file, { mtime, data: fileData });
      break;
    }
  }

  return fileData;
};

type TypeListener = (
  evt: FILE_EVENT,
  src: string,
  fileData: TypeFileData
) => void;

// 监听文件
export default function useSubscribeFile(
  src: string | undefined,
  callback?: TypeListener
): void {
  const dispatch = useEditorDispatch();
  const projectRoot = useProjectRoot();
  useEffect(() => {
    if (!src) return;
    const file = path.join(projectRoot, src);

    // 首次回调
    const fileData = getFileDataWithCache(file);
    callback && callback(FILE_EVENT.ADD, src, fileData);
    dispatch(ActionPatchFileDataMap({ src, fileData }));

    const removeListener = window.$server.useFilesChange(data => {
      if (data.root !== projectRoot) return;
      if (data.src !== src) return;
      callback && callback(data.event, src, data.data);
    });

    return () => {
      removeListener();
      dispatch(ActionPatchFileDataMap({ src, fileData: null }));
    };
  }, [src]);
}
