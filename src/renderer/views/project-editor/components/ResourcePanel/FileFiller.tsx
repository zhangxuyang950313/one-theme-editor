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
import useProjectFile from "@/hooks/useProjectFile";
import useResolveProjectPath from "@/hooks/useResolveProjectPath";
import useResolveResourcePath from "@/hooks/useResolveResourcePath";
import { PreloadImage } from "@/components/ImageCollection";

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

// 文件操作区
const FileHandler: React.FC<{
  exportVisible: boolean;
  resetVisible: boolean;
  deleteVisible: boolean;
  onExport: () => void; // 导出
  onDelete: () => void; // 删除
  onReset: () => void; // 恢复
}> = props => {
  return (
    <StyleFileHandler>
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
    </StyleFileHandler>
  );
};

const StyleFileHandler = styled.div`
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
`;

// 文件展示
const FileDisplay: React.FC<{
  floatUrl: string;
  primaryUrl: string;
  floatToolTipOverlay: ReactNode;
  primaryToolTipOverlay: ReactNode;
  floatIsEmpty: boolean;
  primaryIsEmpty: boolean;
  onFloatClick: () => void; // 点击小图图标
  onPrimaryClick: () => void; // 点击大图
  onPrimaryEmptyClick: () => void; // 空状态的点击
}> = props => {
  return (
    <StyleFileDisplay>
      <div className="display-wrapper">
        {props.primaryIsEmpty ? (
          <div
            className="primary-display empty-display"
            onClick={props.onPrimaryEmptyClick}
          >
            <IconPlus className="plugs-icon" />
          </div>
        ) : (
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
                scale
                dash
                girdSize={17}
                onClick={props.onPrimaryClick}
              />
            </div>
          </Tooltip>
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
              scale={false}
              dash={false}
              src={props.floatUrl}
              onClick={props.onFloatClick}
            />
          </div>
        </Tooltip>
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
`;

const ModifierDescriptions: React.FC<{
  name: string;
  path: string;
  origin: {
    url: string;
    resolution: string;
    size: number;
  };
  current: {
    url: string;
    resolution: string;
    size: number;
  };
}> = props => {
  return (
    <StyleModifierDescriptions
      title="当前资源"
      column={1}
      size="mini"
      data={[
        { label: "名称", value: props.name },
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
              <div className="img">
                <ImageDisplay src={props.origin.url} />
              </div>
              <IconArrowRight className="placeholder" />
              <div className="img">
                <ImageDisplay src={props.current.url} />
              </div>
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
  url: string;
}> = props => {
  return (
    <StyleResourceDescriptions>
      <Descriptions
        title="原始资源"
        column={1}
        size="mini"
        data={[
          { label: "名称", value: props.name },
          { label: "路径", value: props.path },
          { label: "尺寸", value: props.resolution },
          {
            label: "大小",
            value: `${(props.size / 1024).toFixed(2)}kb`
          }
        ]}
      />
      <div className="img">
        <ImageDisplay src={props.url} />
      </div>
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
  const projectFile = useProjectFile(data.sourceData.src);

  const description = getDescription(data.fileData);

  const floatUrl = `resource://${data.sourceData.src}`;
  const primaryUrl = projectFile.url;

  return (
    <StyleFileFiller>
      <div className="file__display-handler">
        <FileDisplay
          floatUrl={floatUrl}
          primaryUrl={primaryUrl}
          floatIsEmpty={false}
          primaryIsEmpty={projectFile.state === FILE_EVENT.UNLINK}
          primaryToolTipOverlay={
            // 变更详情
            <ModifierDescriptions
              name={data.comment}
              path={data.sourceData.src}
              origin={{
                url: floatUrl,
                resolution: getDescription(data.fileData),
                size: data.fileData.size
              }}
              current={{
                url: primaryUrl,
                resolution: getDescription(projectFile.fileData),
                size: projectFile.fileData.size
              }}
            />
          }
          floatToolTipOverlay={
            // 资源详情
            <ResourceDescriptions
              name={data.comment}
              path={data.sourceData.src}
              resolution={getDescription(data.fileData)}
              size={data.fileData.size}
              url={floatUrl}
            />
          }
          // 小图点击使用默认
          onFloatClick={() => {
            window.$one.$server.copyFile({
              from: absoluteResourceFile,
              to: absoluteProjectFile
            });
          }}
          // 大图点击跳转到图片文件夹
          onPrimaryClick={() => {
            remote.shell.showItemInFolder(absoluteProjectFile);
          }}
          onPrimaryEmptyClick={() => onExport(absoluteProjectFile)}
        />
        <FileHandler
          exportVisible={true}
          resetVisible={true}
          deleteVisible={projectFile.state !== FILE_EVENT.UNLINK}
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
          // 恢复默认按钮
          onReset={() => {
            window.$one.$server.copyFile({
              from: absoluteResourceFile,
              to: absoluteProjectFile
            });
          }}
        />
      </div>
      <div className="info">
        <div className="main">{data.comment}</div>
        <div className="secondary">{description}</div>
      </div>
    </StyleFileFiller>
  );
};

const StyleFileFiller = styled.div`
  .file__display-handler {
    display: flex;
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
