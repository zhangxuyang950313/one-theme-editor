import path from "path";

import { remote } from "electron";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import { Descriptions, Divider, Notification } from "@arco-design/web-react";
import {
  IconArrowRight,
  IconPlus,
  IconUndo
} from "@arco-design/web-react/icon";

import { TypeFileItem } from "src/types/config.page";
import { TypeFileData } from "src/types/file-data";
import { FILE_EVENT, PROTOCOL_TYPE } from "src/common/enums";

import ImageDisplay from "./ImageDisplay";
import FileHandler from "./FileHandler";
import FileDisplayFrame from "./FileDisplayFrame";

import ImageElement from "@/components/Previewer/ImageElement";

import { useSubscribeFileData } from "@/hooks/subscribeFile";

function resolveResourceFile(relative: string): string {
  return path.join(window.$one.$reactiveState.get("resourcePath"), relative);
}
function resolveProjectFile(relative: string): string {
  return path.join(window.$one.$reactiveState.get("projectPath"), relative);
}

async function importResource(to: string): Promise<void> {
  // 选择图片导入
  remote.dialog
    .showOpenDialog({
      title: "选择素材",
      properties: ["openFile", "createDirectory"]
    })
    .then(result => {
      if (result.canceled) return;
      window.$one.$server.copyFile({
        from: result.filePaths[0],
        to
      });
    });
}

// 文件填充器
const FileFiller: React.FC<{
  data: TypeFileItem;
  isFocus: boolean;
  onHighlight: (keyPath: string) => void;
}> = props => {
  const { data, isFocus, onHighlight } = props;
  const fileFilterRef = useRef<HTMLDivElement | null>(null);
  const projectFileData = useSubscribeFileData(data.sourceData.src);
  const projectFile = resolveProjectFile(data.sourceData.src);
  const resourceFile = resolveResourceFile(data.sourceData.src);

  const ResourceImageDisplay = (
    <ImageDisplay girdSize={13}>
      <ImageElement
        sourceUrl={`${PROTOCOL_TYPE.resource}://${data.sourceData.src}`}
        sourceData={data.sourceData}
      />
    </ImageDisplay>
  );

  const getPopupContainer = () => fileFilterRef.current || document.body;

  return (
    <StyleFileFiller ref={fileFilterRef}>
      <div className="file-display-info">
        <FileDisplayFrame
          isFocus={isFocus}
          floatNode={
            <Tooltip
              placement="top"
              overlayStyle={{ maxWidth: "none" }}
              getPopupContainer={getPopupContainer}
              destroyTooltipOnHide
              overlay={
                // 资源详情
                <ResourceDescriptions
                  name={data.comment}
                  path={data.sourceData.src}
                  resolution={getDescription(data.fileData)}
                  size={data.fileData.size}
                  PreviewNode={ResourceImageDisplay}
                />
              }
            >
              {/* 左上角悬浮展示 */}
              <span className="float-content">
                {ResourceImageDisplay}
                <Tooltip
                  title="使用默认素材"
                  placement="bottom"
                  destroyTooltipOnHide
                  getPopupContainer={getPopupContainer}
                >
                  <IconUndo
                    className="popup-icon"
                    onClick={() => {
                      window.$one.$server.copyFile({
                        from: resourceFile,
                        to: projectFile
                      });
                    }}
                  />
                </Tooltip>
              </span>
            </Tooltip>
          }
          primaryNode={
            <>
              {projectFileData.state === FILE_EVENT.UNLINK ? (
                <div
                  className="empty-display"
                  onClick={() => importResource(projectFile)}
                >
                  <IconPlus className="plugs-icon" />
                </div>
              ) : (
                <Tooltip
                  placement="top"
                  destroyTooltipOnHide
                  getPopupContainer={getPopupContainer}
                  overlayStyle={{ maxWidth: "none" }}
                  overlay={
                    // 变更详情
                    <ModifierDescriptions
                      name={data.comment}
                      path={data.sourceData.src}
                      origin={{
                        ImageNode: ResourceImageDisplay,
                        resolution: getDescription(data.fileData),
                        size: data.fileData.size
                      }}
                      current={{
                        ImageNode: (
                          <ImageDisplay girdSize={13}>
                            <ImageElement
                              shouldSubscribe
                              sourceUrl={data.sourceUrl}
                              sourceData={data.sourceData}
                            />
                          </ImageDisplay>
                        ),
                        resolution: getDescription(projectFileData.fileData),
                        size: projectFileData.fileData.size
                      }}
                    />
                  }
                >
                  <span>
                    <ImageDisplay
                      girdSize={13}
                      onClick={() => onHighlight(data.keyPath)}
                    >
                      <ImageElement
                        mouseEffect
                        shouldSubscribe
                        sourceUrl={data.sourceUrl}
                        sourceData={data.sourceData}
                      />
                    </ImageDisplay>
                  </span>
                </Tooltip>
              )}
            </>
          }
        />
        <div className="info">
          <div className="main" title={data.comment}>
            {data.comment || "-"}
          </div>
          <div className="secondary">{getDescription(data.fileData)}</div>
        </div>
      </div>
      <FileHandler
        locateVisible={!!data.keyPath}
        exportVisible={projectFileData.state !== FILE_EVENT.UNLINK}
        deleteVisible={projectFileData.state !== FILE_EVENT.UNLINK}
        onLocate={() => remote.shell.showItemInFolder(projectFile)} // 定位资源
        onImport={() => importResource(projectFile)} // 导入资源
        onDelete={() => {
          window.$one.$server.deleteFile(projectFile).catch((err: Error) => {
            Notification.warning({ content: err.message });
          });
        }}
      />
    </StyleFileFiller>
  );
};

const StyleFileFiller = styled.div`
  display: flex;
  .file-display-info {
    display: flex;
    flex-direction: column;
    width: 100px;
    .float-content {
      &:hover {
        .popup-icon {
          cursor: pointer;
          position: absolute;
          top: 0;
          right: 0;
          width: 60%;
          height: 60%;
          padding: 2px;
          line-height: 100%;
          font-size: 10px;
          color: rgb(var(--primary-6));
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 100%;
        }
      }
    }
    .empty-display {
      background-color: var(--color-bg-4);
      &:hover {
        .plugs-icon {
          width: 40%;
          height: 40%;
          margin: 30%;
          transition: 0.2s ease-out;
        }
      }
      .plugs-icon {
        width: 30%;
        height: 30%;
        margin: 35%;
        color: var(--color-text-3);
        transition: 0.2s ease-in;
      }
    }
  }
  .info {
    margin: 5px 0;
    max-width: max-content;
    white-space: nowrap;
    .main {
      font-size: 14px;
      color: var(--color-text-1);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .secondary {
      /* user-select: text; */
      font-size: 12px;
      color: var(--color-text-3);
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export default FileFiller;

const getDescription = (fileData: TypeFileData) => {
  switch (fileData.filetype) {
    case "image/webp":
    case "image/jpeg":
    case "image/gif":
    case "image/png": {
      return `${fileData.width}×${fileData.height}`;
    }
    default: {
      return `${(fileData.size / 1024).toFixed(2)}kb`;
    }
  }
};

const ModifierDescriptions: React.FC<{
  name: string;
  path: string;
  origin: {
    ImageNode: ReactNode;
    resolution: string;
    size: number;
  };
  current: {
    ImageNode: ReactNode;
    resolution: string;
    size: number;
  };
}> = props => {
  return (
    <StyleModifierDescriptions
      title={props.name}
      column={1}
      size="mini"
      data={[
        { label: "路径", value: props.path },
        { label: "", value: <Divider /> },
        {
          label: "",
          value: (
            <div className="flex-alignV-center">
              <div className="item-place">原始资源</div>
              <div style={{ width: "50px" }}></div>
              <div className="item-place">当前资源</div>
            </div>
          )
        },
        {
          label: "对比",
          value: (
            <div className="flex-alignV-center">
              <div className="img">{props.origin.ImageNode}</div>
              <IconArrowRight className="placeholder" />
              <div className="img">{props.current.ImageNode}</div>
            </div>
          )
        },
        {
          label: "尺寸",
          value: (
            <div className="flex-alignV-center">
              <div className="item-place">{props.origin.resolution}</div>
              <div className="placeholder" />
              <div className="item-place">{props.current.resolution}</div>
            </div>
          )
        },
        {
          label: "大小",
          value: (
            <div className="flex-alignV-center">
              <div className="item-place">
                {`${(props.origin.size / 1024).toFixed(2)}kb`}
              </div>
              <div className="placeholder" />
              <div className="item-place">{`${(
                props.current.size / 1024
              ).toFixed(2)}kb`}</div>
            </div>
          )
        }
      ]}
    />
  );
};

const ResourceDescriptions: React.FC<{
  name: string;
  path: string;
  resolution: string;
  size: number;
  PreviewNode: ReactNode;
}> = props => {
  return (
    <StyleResourceDescriptions>
      <Descriptions
        title={props.name}
        column={1}
        size="mini"
        data={[
          { label: "路径", value: props.path },
          { label: "尺寸", value: props.resolution },
          {
            label: "大小",
            value: `${(props.size / 1024).toFixed(2)}kb`
          }
        ]}
      />
      <div className="img">{props.PreviewNode}</div>
    </StyleResourceDescriptions>
  );
};

const StyleModifierDescriptions = styled(Descriptions)`
  .flex-alignV-center {
    display: flex;
    align-items: center;
  }
  .item-place {
    width: 80px;
    text-align: center;
  }
  .placeholder {
    width: 50px;
  }
  .img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid var(--color-border-2);
    background-color: gainsboro;
  }
`;

const StyleResourceDescriptions = styled.div`
  display: flex;
  align-items: center;
  .img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid var(--color-border-2);
    background-color: gainsboro;
  }
`;
