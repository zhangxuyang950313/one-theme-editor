/**
 * 图片替换单元组件
 */
import React from "react";
import { useSelector } from "react-redux";
import { remote } from "electron";

import styled from "styled-components";
import { message } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";

import { TypeTempPageSourceConf } from "types/template";
import { findProjectImage } from "@/store/modules/project/selector";
import { useAddImageMapper } from "@/hooks/project";

import ERR_CODE from "@/core/error-code";

// 图片素材展示
function ShowImage(props: { onClick?: () => void; srcUrl: string }) {
  return (
    <StyleImageBackground srcUrl={props.srcUrl}>
      {props.srcUrl && (
        <div
          className="preview"
          can-click={String(!!props.onClick)}
          onClick={() => props.onClick && props.onClick()}
        />
      )}
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

const ImageChanger: React.FC<TypeTempPageSourceConf> = sourceConf => {
  const handleAddImageMapper = useAddImageMapper();
  const findImage = useSelector(findProjectImage);
  const { from, to, name } = sourceConf;

  if (!from) return null;
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
  // 中间的快速使用默认素材按钮
  const handleUseDefaultResource = () => {
    if (!(Array.isArray(to) && to.length > 0)) {
      message.warn(ERR_CODE[3006]);
      return;
    }
    to.forEach(target => {
      handleAddImageMapper({ ...from, target }).catch(message.warn);
    });
  };
  const { width, height, size } = from;
  return (
    <StyleImageChanger>
      {/* 图片描述 */}
      <div className="text description">
        {name}
        {width && height ? (
          <span className="image-size">
            ({`${width}×${height}`}
            {size && <span> | {(size / 1024).toFixed(1)}kb</span>})
          </span>
        ) : null}
      </div>
      <p className="text filename">{to[0] || from.filename}</p>
      <div className="edit-wrapper">
        <div className="left">
          <ShowImage
            srcUrl={from.url}
            onClick={() => handlePreviewFile(from.url, name)}
          />
        </div>
        <RightCircleOutlined
          className="center"
          onClick={handleUseDefaultResource}
        />
        <div className="right">
          <ShowImage
            srcUrl={findImage(to?.[0])?.url || ""}
            onClick={() => handleShowImageFile(to?.[0])}
          />
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
export default ImageChanger;
