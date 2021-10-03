import React from "react";
import styled from "styled-components";
import { remote } from "electron";
import { RightCircleOutlined } from "@ant-design/icons";

import { apiCopyFile } from "@/request";
import {
  useAbsolutePathInProject,
  useProjectImageUrlBySrc
} from "@/hooks/project/index";
import {
  useAbsolutePathInSource,
  useResourceImageUrl
} from "@/hooks/resource/index";
import { TypeResImageDefinition } from "src/types/resource";

import SourceStatus from "./SourceStatus";
import ImageDisplay from "./ImageDisplay";
import ImageHandler from "./ImageButtons";
import { previewFile } from "./utils";

/**
 * 拷贝素材按钮
 * @param props
 * @returns
 */
// const MiddleCopyButton: React.FC<{ src: string }> = props => {
//   const { src } = props;
//   const sourceConfigRoot = useSourceConfigRoot();
//   const projectRoot = useProjectRoot();
//   return useMemo(() => {
//     if (!sourceConfigRoot || !src) return null;
//     const from = path.join(sourceConfigRoot, src);
//     const release = path.join(projectRoot, src);
//     return (
//       <StyleCopyButton>
//         <RightCircleOutlined onClick={() => apiCopyFile(from, release)} />
//       </StyleCopyButton>
//     );
//   }, [src]);
// };

// const StyleCopyButton = styled.div`
//   cursor: pointer;
//   font-size: 30px;
//   color: ${({ theme }) => theme["@text-color-secondary"]};
//   margin: 0 20px;
//   transition: all 0.5s ease;
//   &:hover {
//     opacity: 0.5;
//     transition: all 0.1s ease;
//   }
// `;

const ImageController: React.FC<{
  className: string;
  imageDefinition: TypeResImageDefinition;
}> = props => {
  const { imageDefinition, className } = props;
  const { data, desc, src } = imageDefinition;
  const resourceImageUrl = useResourceImageUrl(src);
  const projectImageUrl = useProjectImageUrlBySrc(src);
  const absPathInSource = useAbsolutePathInSource(src);
  const absPathInProject = useAbsolutePathInProject(src);

  if (!data) return null;
  const { width, height, size } = data;
  return (
    <StyleImageController className={className}>
      {/* 图片名称 */}
      <div className="name">
        {desc}
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
        <ImageDisplay
          src={resourceImageUrl}
          onClick={() => {
            // 预览图片
            // mac 打开图片预览器，其他平台跳转目录
            if (process.platform !== "darwin") {
              remote.shell.showItemInFolder(absPathInSource);
            } else {
              previewFile(absPathInSource, desc);
            }
          }}
        />
        {/* 一键拷贝默认素材 */}
        <RightCircleOutlined
          className="quick-copy-btn"
          onClick={() => apiCopyFile(absPathInSource, absPathInProject)}
        />
        {/* 工程素材展示 */}
        <ImageDisplay
          src={projectImageUrl}
          onClick={() => remote.shell.showItemInFolder(absPathInProject)}
        />
        <ImageHandler src={src} />
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
    height: 80px;
    .quick-copy-btn {
      cursor: pointer;
      font-size: 30px;
      color: ${({ theme }) => theme["@text-color-secondary"]};
      margin: 0 20px;
      transition: all 0.5s ease;
      &:hover {
        opacity: 0.5;
        transition: all 0.1s ease;
      }
    }
  }
`;
export default ImageController;
