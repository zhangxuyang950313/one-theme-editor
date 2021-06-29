import React from "react";
import styled from "styled-components";
import { localImageToBase64Async } from "common/utils";

type TypeProps = {
  src: string;
  alt: string;
};
// 异步加载本地路径图片
const AsyncImage: React.FC<TypeProps> = ({ src, alt }) => {
  return (
    <StyleAsyncImage
      ref={ref => {
        if (!ref) return;
        localImageToBase64Async(src).then(base64 => {
          ref.src = base64;
        });
      }}
      alt={alt}
    />
  );
};

const StyleAsyncImage = styled.img`
  width: 100%;
`;

export default AsyncImage;
