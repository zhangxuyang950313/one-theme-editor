import React from "react";

import styled from "styled-components";
import { LazyImage } from "@/components/ImageCollection";
import { StyleGirdBackground } from "@/style";

/**
 * 图片素材展示, 底部有个背景
 */

const ImageDisplay: React.FC<{
  className?: string;
  src?: string;
  onClick?: () => void;
}> = props => {
  const { src, onClick, className } = props;

  return (
    <StyleImageDisplay className={className}>
      <LazyImage
        className="preview"
        alt={src}
        src={src}
        can-click={String(!!onClick)}
        onClick={() => onClick && onClick()}
      />
    </StyleImageDisplay>
  );
};

const StyleImageBackground = styled(StyleGirdBackground)`
  flex-shrink: 0;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

const StyleImageDisplay = styled(StyleImageBackground)`
  .preview {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border: 1px dashed red;
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
