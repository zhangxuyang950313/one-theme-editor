import path from "path";
import React, { useMemo } from "react";
import styled from "styled-components";
import { RightCircleOutlined } from "@ant-design/icons";

import { useSourceConfigRoot } from "@/hooks/source";
import { useReleaseListWatcher } from "@/hooks/fileWatcher";
import { TypeSourceImageElement } from "types/source-config";

import { useCopyReleaseWith } from "./hooks";
import LeftDisplay from "./LeftDisplay";
import SourceStatus from "./SourceStatus";
import RightDisplay from "./RightDisplay";

/**
 * 拷贝素材按钮
 * @param props
 * @returns
 */
const MiddleCopyButton: React.FC<{
  sourceUrl: string;
  copyReleaseFn: (copyFrom: string) => void;
}> = props => {
  const { sourceUrl, copyReleaseFn } = props;
  const sourceConfigRoot = useSourceConfigRoot();
  return useMemo(() => {
    if (!sourceConfigRoot || !sourceUrl) return null;
    const absoluteFrom = path.join(sourceConfigRoot, sourceUrl);
    return (
      <StyleCopyButton>
        <RightCircleOutlined onClick={() => copyReleaseFn(absoluteFrom)} />
      </StyleCopyButton>
    );
  }, []);
};

const StyleCopyButton = styled.div`
  cursor: pointer;
  font-size: 30px;
  color: ${({ theme }) => theme["@text-color"]};
  margin: 20px;
  transition: all 0.5s ease;
  &:hover {
    opacity: 0.5;
    transition: all 0.1s ease;
  }
`;

const ImageController: React.FC<TypeSourceImageElement> = imageSource => {
  const { source, releaseList, name } = imageSource;
  const dynamicReleaseList = useReleaseListWatcher(releaseList);
  const copyReleaseWith = useCopyReleaseWith(releaseList, imageSource.name);

  if (!imageSource || !source) return null;

  return (
    <StyleImageChanger>
      {/* 图片描述 */}
      <div className="description">
        {imageSource.name}
        {source.width && source.height ? (
          <span className="image-size">
            ({`${source.width}×${source.height}`}
            {source.size && <span> | {(source.size / 1024).toFixed(1)}kb</span>}
            )
          </span>
        ) : null}
      </div>
      {/* 工程素材状态 */}
      <SourceStatus
        releaseList={releaseList}
        dynamicReleaseList={dynamicReleaseList}
      />
      <div className="edit-wrapper">
        {/* 默认素材展示 */}
        <LeftDisplay src={source.url} name={name} />
        {/* 一键拷贝默认素材 */}
        <MiddleCopyButton
          sourceUrl={source.url}
          copyReleaseFn={copyReleaseWith}
        />
        {/* 工程素材展示 */}
        <RightDisplay
          releaseList={releaseList}
          dynamicReleaseList={dynamicReleaseList}
        />
      </div>
    </StyleImageChanger>
  );
};

const StyleImageChanger = styled.div`
  /* display: inline; */
  /* padding: 10px; */
  margin-bottom: 20px;
  .description {
    width: 100%;
    margin-bottom: 6px;
    font-size: 16px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    .image-size {
      margin-left: 4px;
      font-size: 10px;
      color: ${({ theme }) => theme["@text-color"]};
    }
  }
  .edit-wrapper {
    display: flex;
    flex-direction: wrap;
    align-items: center;
  }
`;
export default ImageController;
