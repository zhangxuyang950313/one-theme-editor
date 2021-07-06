import React from "react";

import styled from "styled-components";
import PreloadImage from "@/components/Image/PreloadImage";

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
      <PreloadImage
        className="preview"
        alt={imageUrl}
        src={imageUrl}
        can-click={String(!!onClick)}
        onClick={() => onClick && onClick()}
      />
    </StyleShowImage>
  );
};

const StyleImageBackground = styled.div`
  position: relative;
  width: 84px;
  height: 84px;
  box-sizing: border-box;
  background-color: #c2c2c2;
  background-image: linear-gradient(45deg, #6d6d6d 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #6d6d6d 0),
    linear-gradient(45deg, #6d6d6d 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #6d6d6d 0);
  background-size: 14px 14px;
  background-position: 0 0, 7px 7px, 7px 7px, 0 0;

  display: flex;
  justify-content: center;
  align-items: center;
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
