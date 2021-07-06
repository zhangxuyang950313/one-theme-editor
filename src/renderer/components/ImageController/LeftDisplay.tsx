import path from "path";
import React, { useMemo } from "react";
import { remote } from "electron";

import { useImageUrl } from "@/hooks/image";
import { useSourceConfigRoot } from "@/hooks/source";
import { previewFile } from "./utils";
import ImageDisplay from "./ImageDisplay";

const LeftDisplay: React.FC<{ src: string; name: string }> = props => {
  const { src, name } = props;
  const sourceConfigRoot = useSourceConfigRoot();
  const filepath = path.join(sourceConfigRoot || "", src || "");
  const imageUrl = useImageUrl(filepath);

  const previewSource = () => {
    if (process.platform !== "darwin") {
      remote.shell.showItemInFolder(filepath);
    } else {
      previewFile(filepath, name);
    }
  };

  // 左边使用 useMemo 进行渲染优化，防止重绘
  return useMemo(() => {
    if (!imageUrl) return null;
    return <ImageDisplay imageUrl={imageUrl} onClick={previewSource} />;
  }, [imageUrl]);
};

export default LeftDisplay;
