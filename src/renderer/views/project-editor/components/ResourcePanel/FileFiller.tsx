import React, { ReactNode } from "react";
import styled from "styled-components";
import { remote } from "electron";
import { Tooltip } from "antd";
import { Notification, Descriptions, Divider } from "@arco-design/web-react";
import {
  IconDelete,
  IconRefresh,
  IconPlus,
  IconArrowRight
} from "@arco-design/web-react/icon";
import { TypeFileItem } from "src/types/config.page";
import { TypeFileData } from "src/types/file-data";
import { FILE_EVENT } from "src/common/enums";
import ImageDisplay from "./ImageDisplay";
import InfoDisplay from "./InfoDisplay";
import useProjectFile from "@/hooks/useProjectFile";
import useResolveProjectPath from "@/hooks/useResolveProjectPath";
import useResolveResourcePath from "@/hooks/useResolveResourcePath";

// 文件操作区
// const FileHandler: React.FC<{}>;

// 文件展示
const FileDisplay: React.FC<{
  name: string;
  description: string;
  floatUrl: string;
  primaryUrl: string;
  primaryToolTipOverlay: ReactNode;
  floatToolTipOverlay: ReactNode;
  exportVisible: boolean;
  resetVisible: boolean;
  deleteVisible: boolean;
  onExport: () => void; // 导出
  onDelete: () => void; // 删除
  onReset: () => void; // 恢复
  onFloatClick: () => void; // 点击小图图标
  onPrimaryClick: () => void; // 点击大图
}> = props => {
  return (
    <StyleFileDisplay>
      <div className="display-wrapper">
        {props.deleteVisible ? (
          <Tooltip
            overlayStyle={{ maxWidth: "none" }}
            destroyTooltipOnHide
            overlay={props.primaryToolTipOverlay}
            placement="top"
          >
            {/* 主要展示区域 */}
            <div className="primary-display">
              <ImageDisplay
                src={props.primaryUrl}
                girdSize={17}
                onClick={props.onPrimaryClick}
              />
            </div>
          </Tooltip>
        ) : (
          <div
            className="primary-display empty-display"
            onClick={props.onExport}
          >
            <IconPlus className="plugs-icon" />
          </div>
        )}
        <Tooltip
          overlayStyle={{ maxWidth: "none" }}
          destroyTooltipOnHide
          overlay={props.floatToolTipOverlay}
          placement="top"
        >
          {/* 左上角悬浮展示 */}
          <div className="float-display">
            <ImageDisplay
              girdSize={10}
              useDash={false}
              src={props.floatUrl}
              onClick={props.onFloatClick}
            />
          </div>
        </Tooltip>
        <div className="info">
          <InfoDisplay main={props.name} secondary={props.description} />
        </div>
      </div>
      <div className="handler">
        {props.deleteVisible && props.exportVisible && (
          <Tooltip destroyTooltipOnHide overlay="导入" placement="right">
            {/* 导入按钮 */}
            <IconPlus className="press btn-normal" onClick={props.onExport} />
          </Tooltip>
        )}
        {/* .9编辑按钮 */}
        {/* <FormOutlined className="press edit" onClick={() => {}} /> */}
        {/* 恢复默认按钮 */}
        {props.deleteVisible && props.resetVisible && (
          <Tooltip destroyTooltipOnHide overlay="默认" placement="right">
            <IconRefresh className="press btn-reset" onClick={props.onReset} />
          </Tooltip>
        )}
        {/* 删除按钮 */}
        {props.deleteVisible && (
          <Tooltip destroyTooltipOnHide overlay="删除" placement="right">
            <IconDelete className="press btn-delete" onClick={props.onDelete} />
          </Tooltip>
        )}
      </div>
    </StyleFileDisplay>
  );
};

const StyleFileDisplay = styled.div`
  display: flex;
  /* 图标和操作悍妞 */
  .display-wrapper {
    position: relative;
    width: 100px;
    .float-display {
      position: absolute;
      left: -5px;
      top: -5px;
      width: 30px;
      height: 30px;
      overflow: hidden;
      border-radius: 5px;
      border: 1px solid var(--color-primary-light-4);
    }
    .primary-display {
      cursor: pointer;
      width: 100px;
      height: 100px;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid var(--color-border-2);
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
  }
  .handler {
    display: flex;
    flex-direction: column;
    width: 26px;
    .press {
      cursor: pointer;
      margin: 5px;
      font-size: 16px;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.5;
      }
    }
    .btn-normal {
      color: var(--color-text-2);
    }
    .btn-delete {
      color: red;
    }
    .btn-reset {
      color: green;
    }
  }
`;

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

// 文件填充器
const FileFiller: React.FC<{ data: TypeFileItem }> = ({ data }) => {
  const absoluteProjectFile = useResolveProjectPath(data.sourceData.src);
  const absoluteResourceFile = useResolveResourcePath(data.sourceData.src);
  const projectFile = useProjectFile(data.sourceData.src);

  const description = getDescription(data.fileData);

  const floatUrl = `resource://${data.sourceData.src}`;
  const primaryUrl = projectFile.url;

  return (
    <FileDisplay
      name={data.comment}
      description={description}
      floatUrl={floatUrl}
      primaryUrl={primaryUrl}
      exportVisible={true}
      resetVisible={true}
      deleteVisible={projectFile.state !== FILE_EVENT.UNLINK}
      primaryToolTipOverlay={
        <>
          <Descriptions
            title="当前资源"
            column={1}
            size="mini"
            data={[
              { label: "名称", value: data.comment },
              { label: "路径", value: data.sourceData.src },
              { label: "", value: <Divider /> },
              {
                label: "",
                value: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: "80px", textAlign: "center" }}>
                      原始资源
                    </div>
                    <div style={{ width: "50px" }}></div>
                    <div style={{ width: "80px", textAlign: "center" }}>
                      当前资源
                    </div>
                  </div>
                )
              },
              {
                label: "",
                value: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      style={{
                        width: "80px",
                        maxHeight: "100px",
                        objectFit: "contain"
                      }}
                      src={floatUrl}
                    />
                    <IconArrowRight style={{ width: "50px" }} />
                    <img
                      style={{
                        width: "80px",
                        maxHeight: "100px",
                        objectFit: "contain"
                      }}
                      src={primaryUrl}
                    />
                  </div>
                )
              },
              {
                label: "尺寸",
                value: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: "80px", textAlign: "center" }}>
                      {description}
                    </div>
                    <div style={{ width: "50px" }} />
                    <div style={{ width: "80px", textAlign: "center" }}>
                      {getDescription(projectFile.fileData)}
                    </div>
                  </div>
                )
              },
              {
                label: "大小",
                value: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: "80px", textAlign: "center" }}>
                      {`${(data.fileData.size / 1024).toFixed(2)}kb`}
                    </div>
                    <div style={{ width: "50px" }} />
                    <div style={{ width: "80px", textAlign: "center" }}>{`${(
                      projectFile.fileData.size / 1024
                    ).toFixed(2)}kb`}</div>
                  </div>
                )
              }
            ]}
          />
        </>
      }
      floatToolTipOverlay={
        <div style={{ display: "flex", alignItems: "center" }}>
          <Descriptions
            title="原始资源"
            column={1}
            size="mini"
            data={[
              { label: "名称", value: data.comment },
              { label: "路径", value: data.sourceData.src },
              { label: "尺寸", value: description },
              {
                label: "大小",
                value: `${(data.fileData.size / 1024).toFixed(2)}kb`
              }
            ]}
          />
          <img
            style={{ width: "80px", maxHeight: "100px", objectFit: "contain" }}
            src={floatUrl}
          />
        </div>
      }
      // 点击导入
      onExport={() => {
        // 选择图片导入
        remote.dialog
          .showOpenDialog({
            title: "选择素材",
            properties: ["openFile", "createDirectory"]
          })
          .then(result => {
            if (result.canceled) return;
            window.$server.copyFile({
              from: result.filePaths[0],
              to: absoluteProjectFile
            });
          });
      }}
      // 删除
      onDelete={() => {
        window.$server.deleteFile(absoluteProjectFile).catch((err: Error) => {
          Notification.warning({ content: err.message });
        });
      }}
      // 恢复默认按钮
      onReset={() => {
        window.$server.copyFile({
          from: absoluteResourceFile,
          to: absoluteProjectFile
        });
      }}
      // 小图点击使用默认
      onFloatClick={() => {
        window.$server.copyFile({
          from: absoluteResourceFile,
          to: absoluteProjectFile
        });
      }}
      // 大图点击跳转到图片文件夹
      onPrimaryClick={() => {
        remote.shell.showItemInFolder(absoluteProjectFile);
      }}
    />
  );
};

export default FileFiller;
