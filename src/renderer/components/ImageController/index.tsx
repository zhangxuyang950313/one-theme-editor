import path from "path";
import React from "react";
import { remote } from "electron";

import styled from "styled-components";
import { notification } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";

import { apiCopyFile } from "@/api";
import { useProjectRoot } from "@/hooks/project";
import { useSourceConfigRoot } from "@/hooks/sourceConfig";
import { useToListWatcher } from "@/hooks/fileWatcher";
import { TypeSCPageSourceConf } from "types/source-config";
import ERR_CODE from "@/core/error-code";

import { previewFile } from "./utils";

import Context from "./Context";
import ImageDisplay from "./ImageDisplay";
import ProjectSource from "./ProjectSource";
import SourceStatus from "./SourceStatus";

const ImageController: React.FC<TypeSCPageSourceConf> = sourceConf => {
  const { from, to } = sourceConf;
  const projectRoot = useProjectRoot();
  const sourceConfigRoot = useSourceConfigRoot();
  const dynamicToList = useToListWatcher(to);

  if (!sourceConf || !from || !sourceConfigRoot || !projectRoot) return null;

  // 素材绝对路径
  const absoluteFrom = path.join(sourceConfigRoot, from.relativePath);

  // 目标素材绝对路径列表
  const absoluteToList = to.map(item => path.join(projectRoot, item));

  // 拷贝到模板素材
  const copyToWith = (file: string) => {
    if (!(Array.isArray(to) && to.length > 0)) {
      notification.warn({ message: `"${sourceConf.name}"${ERR_CODE[3006]}` });
      return;
    }
    absoluteToList.forEach(target => {
      apiCopyFile(file, target);
    });
  };
  // 拷贝默认素材
  const handleCopyDefault = () => {
    copyToWith(absoluteFrom);
  };
  return (
    <StyleImageChanger>
      <Context.Provider value={{ toList: to, dynamicToList }}>
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
        <SourceStatus />
        <div className="edit-wrapper">
          <div className="left">
            <ImageDisplay
              filepath={absoluteFrom}
              onClick={() => {
                if (process.platform !== "darwin") {
                  remote.shell.showItemInFolder(absoluteFrom);
                } else {
                  previewFile(absoluteFrom, sourceConf.name);
                }
              }}
            />
          </div>
          {/* 一键拷贝默认素材 */}
          <RightCircleOutlined className="center" onClick={handleCopyDefault} />
          <div className="right">
            <ProjectSource />
          </div>
        </div>
      </Context.Provider>
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
  .to-basename {
    font-size: 10px;
    color: ${({ theme }) => theme["@text-color-secondary"]};
    user-select: text;
    max-width: 100%;
    /* overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
    &[data-exists="true"] {
      cursor: pointer;
    }
    &[data-exists="false"] {
      opacity: 0.5;
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
