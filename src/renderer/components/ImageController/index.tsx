import path from "path";
import React, { useMemo } from "react";
import { remote } from "electron";

import styled from "styled-components";
import { RightCircleOutlined } from "@ant-design/icons";

import { useProjectPathname } from "@/hooks/project";
import { useSourceConfigRoot } from "@/hooks/source";
import { useReleaseListWatcher } from "@/hooks/fileWatcher";
import { TypeSourceImageElement } from "types/source-config";

import { useImageUrl } from "@/hooks/image";
import { previewFile } from "./utils";

import { useCopyReleaseWith } from "./hooks";
import PartialContext from "./Context";
import ImageDisplay from "./ImageDisplay";
import ProjectDisplay from "./ProjectDisplay";
import SourceStatus from "./SourceStatus";

const ImageController: React.FC<TypeSourceImageElement> = sourceConf => {
  const { source, releaseList } = sourceConf;
  const projectPathname = useProjectPathname();
  const sourceConfigRoot = useSourceConfigRoot();
  const dynamicReleaseList = useReleaseListWatcher(releaseList);
  const copyReleaseWith = useCopyReleaseWith(releaseList, sourceConf.name);

  if (!sourceConf || !source || !sourceConfigRoot || !projectPathname) {
    return null;
  }

  // 素材绝对路径
  const absoluteFrom = path.join(sourceConfigRoot, source.url);

  // 左边使用 useMemo 进行渲染优化，防止重绘
  const MemoLeftSource = () => {
    const imageUrl = useImageUrl(absoluteFrom);
    return useMemo(() => {
      return (
        <ImageDisplay
          imageUrl={imageUrl}
          onClick={() => {
            if (process.platform !== "darwin") {
              remote.shell.showItemInFolder(absoluteFrom);
            } else {
              previewFile(absoluteFrom, sourceConf.name);
            }
          }}
        />
      );
    }, []);
  };

  return (
    <StyleImageChanger>
      <PartialContext.Provider value={{ releaseList, dynamicReleaseList }}>
        {/* 图片描述 */}
        <div className="description">
          {sourceConf.name}
          {source.width && source.height ? (
            <span className="image-size">
              ({`${source.width}×${source.height}`}
              {source.size && (
                <span> | {(source.size / 1024).toFixed(1)}kb</span>
              )}
              )
            </span>
          ) : null}
        </div>
        <SourceStatus />
        <div className="edit-wrapper">
          <div className="left">
            {/* 素材展示 memo 组件 */}
            <MemoLeftSource />
          </div>
          {/* 一键拷贝默认素材 */}
          <RightCircleOutlined
            className="center"
            onClick={() => copyReleaseWith(absoluteFrom)}
          />
          <div className="right">
            <ProjectDisplay />
          </div>
        </div>
      </PartialContext.Provider>
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
    .left,
    .right {
      /* margin: 10px; */
    }
    .center {
      cursor: pointer;
      font-size: 30px;
      color: ${({ theme }) => theme["@text-color"]};
      margin: 20px;
      transition: all 0.5s ease;
      &:hover {
        opacity: 0.5;
        transition: all 0.1s ease;
      }
    }
  }
`;
export default ImageController;
