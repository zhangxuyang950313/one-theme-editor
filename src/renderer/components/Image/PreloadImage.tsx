import React, { useEffect } from "react";
import styled from "styled-components";
import { useLoadImage } from "@/hooks/image";

/**
 * 封装 img 为预加载图片
 * 用于预加载图片，不会从上到下慢慢加载，加载失败则不会有 img 节点
 * @param props 和 img 标签具有相同的属性
 */
const PreloadImage: React.FC<JSX.IntrinsicElements["img"]> = props => {
  const [imageUrl, doReload] = useLoadImage(props.src);

  useEffect(() => {
    if (!props.src) return;
    doReload(props.src);
  }, [props.src]);

  if (!imageUrl || !props.src) return null;
  return (
    <StylePreloadImage>
      <img {...props} src={imageUrl} alt={props.src} />
    </StylePreloadImage>
  );
};

const StylePreloadImage = styled.div`
  img {
    width: 100%;
    height: 100%;
  }
`;

export default PreloadImage;
