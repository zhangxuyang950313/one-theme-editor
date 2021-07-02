import React, { useEffect, useState } from "react";

import styled from "styled-components";
import PreloadImage from "@/components/Image/PreloadImage";

import { useImageUrl } from "@/hooks/image";

// 图片素材展示
type TypePropsOfShowImage = {
  filepath?: string;
  onClick?: () => void;
  // showHandler 时就要强制传入 to 列表
} & (
  | { showHandler: true; absoluteToList: string[] }
  | { showHandler?: false; absoluteToList?: string[] }
);

const ImageDisplay: React.FC<TypePropsOfShowImage> = props => {
  const { filepath, absoluteToList, onClick } = props;

  // 图片参数改变，用于重载
  const [count, updateCount] = useState(0);

  const [imageUrl, handleChange] = useImageUrl();

  // 图片重载
  useEffect(() => {
    if (!filepath) {
      handleChange("");
      return;
    }
    handleChange(`${filepath}&count=${count}`);
    updateCount(count + 1);
  }, [absoluteToList]);

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

const StyleShowImage = styled(StyleImageBackground)``;

export default ImageDisplay;
