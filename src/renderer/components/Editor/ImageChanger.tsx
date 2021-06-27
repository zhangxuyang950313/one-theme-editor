// 图片替换单元组件
import path from "path";
import fse from "fs-extra";
import React from "react";
import { remote } from "electron";

// components
import styled from "styled-components";
import { message, notification } from "antd";
import {
  RightCircleOutlined,
  DeleteOutlined,
  FormOutlined,
  ImportOutlined
} from "@ant-design/icons";

// script
import { apiCopyFile, apiDeleteFile } from "@/api";
import { useImagePrefix, useProjectImageUrl } from "@/hooks/index";
import { useProjectRoot } from "@/hooks/project";
import { useSourceConfigRoot } from "@/hooks/sourceConfig";
import { TypeSCPageSourceConf } from "types/source-config";
import ERR_CODE from "@/core/error-code";

// 图片素材展示
type TypePropsOfShowImage = {
  srcUrl?: string;
  onClick?: () => void;
  // showHandler 时就要强制传入 to 列表
} & (
  | { showHandler: true; to: string[] }
  | { showHandler?: false; to?: string[] }
);
function ImageShower(props: TypePropsOfShowImage) {
  const { srcUrl, showHandler, to, onClick } = props;
  const projectRoot = useProjectRoot();
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
          if (!to || !projectRoot) return;
          to.forEach(item => {
            console.log(`删除图标: ${item}`);
            apiDeleteFile(item);
          });
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

const StyleImageBackground = styled.div<{ srcUrl?: string }>`
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

const ImageChanger: React.FC<TypeSCPageSourceConf> = sourceConf => {
  const sourceConfigRoot = useSourceConfigRoot();
  const projectRoot = useProjectRoot();
  const imagePrefix = useImagePrefix();

  const { from, to } = sourceConf;
  if (!sourceConf || !from || !sourceConfigRoot || !projectRoot) return null;

  // 素材绝对路径
  const absoluteFrom = path.join(sourceConfigRoot, from.relativePath);

  // 素材映射绝对路径列表
  const absoluteToList = to
    .map(item => path.join(projectRoot || "", item))
    .filter(fse.existsSync);

  // 至少拿出一个可用于展示的图片本地路径
  const getAbsoluteTo = () => {
    const target = (to || []).filter(Boolean)[0];
    return target ? path.join(projectRoot, target) : "";
  };
  const absoluteTo = getAbsoluteTo();

  /**
   * 点击原始素材，mac 支持小窗预览
   * @param filepath
   * @param name
   */
  const previewFile = (filepath: string, name: string) => {
    if (process.platform !== "darwin") return;
    remote.getCurrentWindow().previewFile(filepath, name);
  };
  // 点击素材图片
  const showImageFileInFolder = (target: string) => {
    remote.shell.showItemInFolder(target);
  };
  // 中间的快速使用默认素材按钮
  const copyDefaultImage = () => {
    if (!(Array.isArray(to) && to.length > 0)) {
      notification.warn({ message: `"${sourceConf.name}"${ERR_CODE[3006]}` });
      return;
    }
    if (!sourceConfigRoot) {
      message.warn({ content: ERR_CODE[3008] });
      return;
    }
    to.forEach(target => {
      const err = () =>
        notification.warn({ message: `${ERR_CODE[4004]}(${from.filename})` });
      if (!projectRoot) {
        console.warn("projectRoot 为空");
        err();
        return;
      }
      apiCopyFile(
        path.join(sourceConfigRoot, from.relativePath),
        path.join(projectRoot, target)
      );
    });
  };
  return (
    <StyleImageChanger>
      {/* 图片描述 */}
      <div className="text description">
        {sourceConf.name}
        {from.width && from.height ? (
          <span className="image-size">
            ({`${from.width}×${from.height}`}
            {from.size && <span> | {(from.size / 1024).toFixed(1)}kb</span>})
          </span>
        ) : null}
      </div>
      {to.map(relativePath => (
        <p key={relativePath} className="text to-relative-path">
          {relativePath}
        </p>
      ))}
      <div className="edit-wrapper">
        <div className="left">
          <ImageShower
            srcUrl={imagePrefix + absoluteFrom}
            onClick={() => {
              if (process.platform !== "darwin") {
                showImageFileInFolder(absoluteFrom);
              } else {
                previewFile(absoluteFrom, sourceConf.name);
              }
            }}
          />
        </div>
        <RightCircleOutlined className="center" onClick={copyDefaultImage} />
        <div className="right">
          <ImageShower
            showHandler
            srcUrl={imagePrefix + absoluteTo}
            to={absoluteToList}
            onClick={() => showImageFileInFolder(absoluteTo)}
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
  .to-relative-path {
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
