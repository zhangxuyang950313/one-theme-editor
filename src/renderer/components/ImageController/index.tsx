import path from "path";
import React, { useMemo } from "react";
import styled from "styled-components";
import { RightCircleOutlined } from "@ant-design/icons";

import { apiCopyFile } from "@/request";
import { useProjectImageUrlBySrc, useProjectRoot } from "@/hooks/project";
import { useSourceConfigRoot } from "@/hooks/source";
import { TypeSourceDefineImage } from "types/source";

import LeftDisplay from "./LeftDisplay";
import SourceStatus from "./SourceStatus";
import RightDisplay from "./RightDisplay";

/**
 * 拷贝素材按钮
 * @param props
 * @returns
 */
const MiddleCopyButton: React.FC<{ src: string }> = props => {
  const { src } = props;
  const sourceConfigRoot = useSourceConfigRoot();
  const projectRoot = useProjectRoot();
  return useMemo(() => {
    if (!sourceConfigRoot || !src) return null;
    const from = path.join(sourceConfigRoot, src);
    const release = path.join(projectRoot, src);
    return (
      <StyleCopyButton>
        <RightCircleOutlined onClick={() => apiCopyFile(from, release)} />
      </StyleCopyButton>
    );
  }, [src]);
};

const StyleCopyButton = styled.div`
  cursor: pointer;
  font-size: 30px;
  color: ${({ theme }) => theme["@text-color-secondary"]};
  margin: 20px;
  transition: all 0.5s ease;
  &:hover {
    opacity: 0.5;
    transition: all 0.1s ease;
  }
`;

const ImageController: React.FC<{
  sourceDefine: TypeSourceDefineImage;
  onChange: (val: string) => void;
}> = props => {
  const { sourceDefine, onChange } = props;
  const { sourceData, description, src } = sourceDefine;

  const imageUrl = useProjectImageUrlBySrc(sourceDefine.src);
  if (!sourceData) return null;
  const { width, height, size } = sourceData;
  return (
    <StyleImageController>
      {/* 图片名称 */}
      <div className="name">
        {description}
        {width && height ? (
          <span className="image-size">
            ({`${width}×${height}`}
            {size && <span> | {(size / 1024).toFixed(1)}kb</span>})
          </span>
        ) : null}
      </div>
      {/* 工程素材状态 */}
      <SourceStatus src={src} />
      <div className="edit-wrapper">
        {/* 默认素材展示 */}
        <LeftDisplay src={src} sourceName={description} />
        {/* 一键拷贝默认素材 */}
        <MiddleCopyButton src={src} />
        {/* 工程素材展示 */}
        <RightDisplay src={src} url={imageUrl} />
      </div>
    </StyleImageController>
  );
};

const StyleImageController = styled.div`
  .name {
    width: 100%;
    margin-bottom: 6px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    font-size: ${({ theme }) => theme["@text-size-big"]};
    color: ${({ theme }) => theme["@text-color"]};
    .image-size {
      margin-left: 4px;
      font-size: ${({ theme }) => theme["@text-size-secondary"]};
      color: ${({ theme }) => theme["@text-color-secondary"]};
    }
  }
  .edit-wrapper {
    display: flex;
    flex-direction: wrap;
    align-items: center;
  }
`;
export default ImageController;
