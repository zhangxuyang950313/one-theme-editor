/**
 * 图片替换单元组件
 */
import React from "react";
import { useSelector } from "react-redux";
import { remote } from "electron";

import styled from "styled-components";
import { notification } from "antd";
import {
  RightCircleOutlined,
  DeleteOutlined,
  FormOutlined,
  ImportOutlined
} from "@ant-design/icons";

import { TypeTempPageSourceConf } from "types/template";
import { findProjectImage } from "@/store/modules/project/selector";
import { useAddImageMapper, useDelImageMapper } from "@/hooks/project";

import ERR_CODE from "@/core/error-code";

// 图片素材展示
type TypePropsOfShowImage = {
  srcUrl: string | null;
  onClick?: () => void;
  // showHandler 时就要强制传入 target
} & (
  | { showHandler: true; target: string[] }
  | { showHandler?: false; target?: string[] }
);
function ImageShower(props: TypePropsOfShowImage) {
  const { srcUrl, showHandler, target, onClick } = props;
  const handelDelImageMapper = useDelImageMapper();
  const Content: React.FC = () => {
    return (
      <StyleImageBackground srcUrl={srcUrl}>
        <div
          className="preview"
          can-click={String(!!onClick)}
          onClick={() => onClick && onClick()}
        />
      </StyleImageBackground>
    );
  };
  const Handler: React.FC = () => {
    // 导入按钮
    const ImportButton = <ImportOutlined className="press import" />;
    // .9编辑按钮
    const EditButton = <FormOutlined className="press edit" />;
    // 删除按钮
    const DeleteButton = (
      <DeleteOutlined
        className="press delete"
        onClick={() => {
          if (!target) return;
          target.forEach(handelDelImageMapper);
        }}
      />
    );
    return (
      <div className="handler">
        {ImportButton}
        {srcUrl && EditButton}
        {srcUrl && DeleteButton}
      </div>
    );
  };
  return (
    <StyleShowImage>
      <Content />
      {/* 支持操作 */}
      {showHandler && <Handler />}
    </StyleShowImage>
  );
}

const StyleShowImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  .handler {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 20px;
    margin: 0 10px;
    .press {
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.5;
      }
    }
    .import {
      font-size: 19px;
      color: gray;
    }
    .edit {
      font-size: 18px;
      color: gray;
    }
    .delete {
      color: red;
    }
  }
`;

const StyleImageBackground = styled.div<{ srcUrl: string | null }>`
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
    background: center/contain url(${({ srcUrl }) => srcUrl || ""}) no-repeat;
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
      notification.warn({ message: `"${name}"${ERR_CODE[3006]}` });
      return;
    }
    to.forEach(target => {
      handleAddImageMapper({ ...from, target }).catch(({ message }) =>
        notification.warn({ message })
      );
    });
  };
  const { width, height, size } = from;
  const targetImage = findImage(to?.[0]);
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
      {to.map(item => (
        <p key={item} className="text filename">
          {item || from.filename}
        </p>
      ))}
      <div className="edit-wrapper">
        <div className="left">
          <ImageShower
            srcUrl={from.url || ""}
            onClick={() => handlePreviewFile(from.url, name)}
          />
        </div>
        <RightCircleOutlined
          className="center"
          onClick={handleUseDefaultResource}
        />
        <div className="right">
          <ImageShower
            showHandler
            srcUrl={targetImage?.url || null}
            target={to}
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
    max-width: 100%;
    /* overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
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
