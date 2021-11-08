import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { LazyImage } from "@/components/ImageCollection";
import { StyleGirdBackground } from "@/style";

/**
 * 图片素材展示, 底部有个背景
 */

const ImageDisplay: React.FC<{
  src?: string;
  useDash?: boolean;
  girdSize?: number;
  onClick?: () => void;
}> = props => {
  const { src, onClick, useDash, girdSize } = props;

  const [display, setDisplay] = useState(true);

  useEffect(() => {
    setDisplay(true);
  }, [src]);

  return (
    <StyleImageDisplay girdSize={girdSize} onClick={() => onClick && onClick()}>
      <LazyImage
        className="preview"
        alt=""
        src={src}
        use-dash={String(!!(useDash && display))}
        can-click={String(!!onClick)}
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
`;

const StyleImageDisplay = styled(StyleImageBackground)`
  .preview {
    position: relative;
    left: 0;
    top: 0;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    &[use-dash="true"] {
      border: 1px dashed red;
    }
    /* background: center/contain no-repeat; */
    &[can-click="true"] {
      cursor: pointer;
      transform: scale(0.8);
      transition: transform 0.3s ease;
      &:hover {
        transform: scale(0.9);
        transition: transform 0.1s ease;
        filter: drop-shadow(0 0 1px var(--color-primary-light-4));
      }
    }
  }
`;

export default ImageDisplay;
