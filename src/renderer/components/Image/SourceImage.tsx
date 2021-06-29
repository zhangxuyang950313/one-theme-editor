import React, { useEffect } from "react";
import { useLoadImage, useSourceImageUrl } from "@/hooks/image";
import PreloadImage from "./PreloadImage";

/**
 * 用于显示素材图片
 * @param props 和 img 标签具有相同的属性
 */
const SourceImage: React.FC<JSX.IntrinsicElements["img"]> = props => {
  const [sourceUrl, updateSourceUrl] = useSourceImageUrl(props.src);
  const [url, doReload] = useLoadImage(sourceUrl);

  console.log({ url });
  useEffect(() => {
    if (!props.src) return;
    updateSourceUrl(props.src);
    console.log({ sourceUrl });
  }, [props.src]);

  useEffect(() => {
    doReload(sourceUrl);
  }, [sourceUrl]);

  return <PreloadImage {...props} src={url} alt={url} />;
};

export default SourceImage;
