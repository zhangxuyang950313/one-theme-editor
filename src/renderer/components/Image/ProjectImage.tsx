import React, { useEffect } from "react";
import { useLoadImage, useSourceImageUrl } from "@/hooks/image";

/**
 * 用于显示工程图片
 * @param props 和 img 标签具有相同的属性
 */
const ProjectImage: React.FC<JSX.IntrinsicElements["img"]> = props => {
  const [sourceUrl, updateSourceUrl] = useSourceImageUrl(props.src);
  const [url, doReload] = useLoadImage(sourceUrl);

  useEffect(() => {
    if (!props.src) return;
    updateSourceUrl(props.src);
  }, [props.src]);

  useEffect(() => {
    doReload(sourceUrl);
  }, [sourceUrl]);
  return url && props.src ? <img {...props} src={url} alt={props.src} /> : null;
};

export default ProjectImage;
