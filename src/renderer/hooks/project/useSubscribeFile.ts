import { useEffect } from "react";
import { useEditorDispatch } from "@/store/editor";
import { ActionPatchFileDataMap } from "@/store/editor/action";
import { FILE_EVENT } from "src/enum";
import { useProjectRoot } from "./index";

type TypeListener = (evt: FILE_EVENT) => void;

export default function useSubscribeFile(
  src: string | undefined,
  callback?: TypeListener
): void {
  const dispatch = useEditorDispatch();
  const projectRoot = useProjectRoot();
  useEffect(() => {
    if (!callback || !src) return;
    callback(FILE_EVENT.ADD);
    const removeListener = window.$server.useFilesChange(data => {
      if (data.root !== projectRoot) return;
      if (data.src === src) callback(data.event);
    });
    return () => {
      removeListener();
      dispatch(ActionPatchFileDataMap({ src, fileData: null }));
    };
  }, [src]);
}
