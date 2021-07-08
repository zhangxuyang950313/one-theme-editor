import React from "react";

import styled from "styled-components";
import { LazyImage } from "@/components/ImageCollection";
import { StyleGirdBackground } from "@/style";

/**
 * 图片素材展示, 底部有个背景
 */
type TypePropsOfShowImage = {
  imageUrl?: string;
  onClick?: () => void;
};

const ImageDisplay: React.FC<TypePropsOfShowImage> = props => {
  const { imageUrl, onClick } = props;

  return (
    <StyleShowImage>
      <LazyImage
        className="preview"
        alt={imageUrl}
        src={imageUrl}
        can-click={String(!!onClick)}
        onClick={() => onClick && onClick()}
      />
    </StyleShowImage>
  );
};

const StyleImageBackground = styled(StyleGirdBackground)`
  flex-shrink: 0;
  position: relative;
  width: 84px;
  height: 84px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

const StyleShowImage = styled(StyleImageBackground)`
  .preview {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    /* background: center/contain no-repeat; */
    &[can-click="true"] {
      cursor: pointer;
      transform: scale(0.8);
      transition: transform 0.3s ease;
      &:hover {
        transform: scale(0.9);
        transition: transform 0.1s ease;
      }
    }
  }
`;

export default ImageDisplay;
