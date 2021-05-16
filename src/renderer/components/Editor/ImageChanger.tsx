/**
 * 图片替换单元组件
 */
import path from "path";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { remote } from "electron";

import { RightCircleOutlined } from "@ant-design/icons";
import { TypeTempPageSourceConf } from "@/../types/project";
// import { TypeImageSourceElement } from "@/store/types";
// import { copyFile, loadImageUseImgHTML } from "@/core/utils";

// 图片素材展示
function ShowImage(props: { onClick?: () => void; srcUrl: string }) {
  return (
    <StyleImageBackground srcUrl={props.srcUrl}>
      <div
        className="preview"
        can-click={String(!!props.onClick)}
        onClick={() => props.onClick && props.onClick()}
      ></div>
    </StyleImageBackground>
  );
}

const StyleImageBackground = styled.div<{ srcUrl: string }>`
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
    background: center/contain url(${({ srcUrl }) => srcUrl}) no-repeat;
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

type TypeProps = {
  data: TypeTempPageSourceConf;
};
const ResourceChanger: React.FC<TypeProps> = props => {
  const [{ width, height }, setImageSize] = useState({ width: 0, height: 0 });
  const { from, to, description } = props.data;
  // useEffect(() => {
  //   loadImageUseImgHTML(from).then(({ width, height }) =>
  //     setImageSize({ width, height })
  //   );
  // }, [from]);
  // const watchFileOptions = { interval: 100 };
  // fs.watchFile(to, watchFileOptions, (e, f) => {
  //   loadWorkImage();
  // });
  /**
   * 点击原始素材，mac 支持小窗预览
   * @param from
   * @param description
   */
  const handlePreviewFile = (from: string, description: string) => {
    if (process.platform !== "darwin") return;
    const currentWindow = remote.getCurrentWindow();
    currentWindow.previewFile(from, description);
  };
  // 点击素材图片
  const handleShowImageFile = (target: string) => {
    remote.shell.showItemInFolder(target);
  };
  // 将图片资源移动至工作目录
  const handleMoveResourceToWorkDir = () => {
    // TODO 批量复制文件
    // copyFile(from, to[0]);
    // .then(loadWorkImage);
  };
  return (
    <StyleImageChanger>
      {/* 图片描述 */}
      <div className="text description">
        {description}
        {width && height ? (
          <span className="image-size">({`${width}×${height}`})</span>
        ) : null}
      </div>
      <p className="text filename">{path.basename(from)}</p>
      <div className="edit-wrapper">
        <div className="left">
          <ShowImage
            srcUrl={from}
            onClick={() => handlePreviewFile(from, description)}
          ></ShowImage>
        </div>
        <RightCircleOutlined
          className="center"
          onClick={handleMoveResourceToWorkDir}
        />
        <div className="right">
          <ShowImage
            srcUrl={to[0]}
            onClick={() => handleShowImageFile(to[0])}
          ></ShowImage>
        </div>
      </div>
    </StyleImageChanger>
  );
};

const StyleImageChanger = styled.div`
  /* display: inline; */
  /* padding: 10px; */
  margin-bottom: 20px;
  .text {
    margin-bottom: 6px;
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
  }
  .description {
    font-size: 14px;
    .image-size {
      margin-left: 4px;
      font-size: 10px;
      color: ${({ theme }) => theme["@text-color"]};
    }
  }
  .filename {
    font-size: 10px;
    color: ${({ theme }) => theme["@text-color-secondary"]};
    user-select: text;
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
export default ResourceChanger;
