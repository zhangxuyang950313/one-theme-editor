import React, { ReactNode } from "react";
import styled from "styled-components";
import { remote } from "electron";
import { Tooltip } from "antd";
import { Notification, Descriptions, Divider } from "@arco-design/web-react";
import { IconArrowRight, IconPlus } from "@arco-design/web-react/icon";
import { TypeFileItem } from "src/types/config.page";
import { TypeFileData } from "src/types/file-data";
import { FILE_EVENT } from "src/common/enums";
import ImageElement from "../../Previewer/ImageElement";
import ImageDisplayFrame from "../ImageDisplayFrame";
import FileHandler from "./FileHandler";
import FileDisplayFrame from "./FileDisplayFrame";
import useSubscribedSrc from "@/hooks/useProjectFile";
import useResolveProjectPath from "@/hooks/useResolveProjectPath";
import useResolveResourcePath from "@/hooks/useResolveResourcePath";
import { previewResourceEmitter } from "@/singletons/emitters";

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

const onExport = (to: string) => {
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
          label: "",
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

// 文件填充器
const FileFiller: React.FC<{ data: TypeFileItem }> = ({ data }) => {
  const absoluteProjectFile = useResolveProjectPath(data.sourceData.src);
  const absoluteResourceFile = useResolveResourcePath(data.sourceData.src);
  const projectFile = useSubscribedSrc(data.sourceData.src);

  const ResourceNode = (
    <ImageDisplayFrame girdSize={16}>
      <ImageElement sourceUrl={data.sourceUrl} sourceData={data.sourceData} />
    </ImageDisplayFrame>
  );

  return (
    <StyleFileFiller>
      <div className="file-display-info">
        <FileDisplayFrame
          floatNode={
            <Tooltip
              overlayStyle={{ maxWidth: "none" }}
              destroyTooltipOnHide
              placement="top"
              overlay={
                // 资源详情
                <ResourceDescriptions
                  name={data.comment}
                  path={data.sourceData.src}
                  resolution={getDescription(data.fileData)}
                  size={data.fileData.size}
                  PreviewNode={ResourceNode}
                />
              }
            >
              {/* 左上角悬浮展示 */}
              <span>
                <ImageDisplayFrame girdSize={6}>
                  <img
                    style={{
                      display: "inherit",
                      height: "100%",
                      cursor: "pointer"
                    }}
                    src={data.sourceUrl}
                    alt=""
                    onClick={() => {
                      window.$one.$server.copyFile({
                        from: absoluteResourceFile,
                        to: absoluteProjectFile
                      });
                    }}
                  />
                </ImageDisplayFrame>
              </span>
            </Tooltip>
          }
          primaryNode={
            <>
              {projectFile.state === FILE_EVENT.UNLINK ? (
                <div
                  className="empty-display"
                  onClick={() => onExport(absoluteProjectFile)}
                >
                  <IconPlus className="plugs-icon" />
                </div>
              ) : (
                <Tooltip
                  overlayStyle={{ maxWidth: "none" }}
                  destroyTooltipOnHide
                  placement="top"
                  overlay={
                    // 变更详情
                    <ModifierDescriptions
                      name={data.comment}
                      path={data.sourceData.src}
                      origin={{
                        ImageNode: ResourceNode,
                        resolution: getDescription(data.fileData),
                        size: data.fileData.size
                      }}
                      current={{
                        ImageNode: (
                          <ImageDisplayFrame girdSize={18}>
                            <ImageElement
                              sourceUrl={data.sourceUrl}
                              sourceData={data.sourceData}
                            />
                          </ImageDisplayFrame>
                        ),
                        resolution: getDescription(projectFile.fileData),
                        size: projectFile.fileData.size
                      }}
                    />
                  }
                >
                  <span>
                    <ImageDisplayFrame
                      girdSize={18}
                      onClick={() => {
                        remote.shell.showItemInFolder(absoluteProjectFile);
                      }}
                    >
                      <ImageElement
                        mouseEffect
                        sourceUrl={data.sourceUrl}
                        sourceData={data.sourceData}
                      />
                    </ImageDisplayFrame>
                  </span>
                </Tooltip>
              )}
            </>
          }
        />
        <div className="info">
          <div className="main">{data.comment}</div>
          <div className="secondary">{getDescription(data.fileData)}</div>
        </div>
      </div>
      <FileHandler
        locateVisible
        exportVisible={projectFile.state !== FILE_EVENT.UNLINK}
        deleteVisible={projectFile.state !== FILE_EVENT.UNLINK}
        onLocate={() => {
          previewResourceEmitter.emit("locate:layout", data.sourceUrl);
        }}
        // 点击导入
        onExport={() => onExport(absoluteProjectFile)}
        // 删除
        onDelete={() => {
          window.$one.$server
            .deleteFile(absoluteProjectFile)
            .catch((err: Error) => {
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
    .main {
      font-size: 14px;
      color: var(--color-text-1);
    }
    .secondary {
      /* user-select: text; */
      font-size: 12px;
      color: var(--color-text-3);
    }
  }
`;

export default FileFiller;
