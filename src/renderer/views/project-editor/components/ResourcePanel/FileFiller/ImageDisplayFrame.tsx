import React from "react";
import styled from "styled-components";

import { StyleGirdBackground } from "@/style";

/**
 * 图片素材展示, 底部有个背景
 */

const ImageDisplayFrame: React.FC<{
  src?: string;
  girdSize?: number;
  onClick?: () => void;
}> = props => {
  const { girdSize, onClick } = props;

  return (
    <StyleImageDisplay
      girdSize={girdSize || 18}
      onClick={() => onClick && onClick()}
    >
      <span className="thumbnail">{props.children}</span>
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
  .thumbnail {
    position: relative;
    left: 0;
    top: 0;
    /* width: 100%; */
    height: 80%;
    object-fit: contain;
  }
`;

export default ImageDisplayFrame;
