import { useAsyncImage } from "@/hooks";
import React from "react";
import styled from "styled-components";

type TypeProps = {
  src: string;
  alt: string;
};
// 异步加载图片
const AsyncImage: React.FC<TypeProps> = ({ src, alt }) => {
  const image = useAsyncImage(src);
  return <StyleAsyncImage src={image} alt={alt} />;
};

const StyleAsyncImage = styled.img`
  width: 100%;
`;

export default AsyncImage;
