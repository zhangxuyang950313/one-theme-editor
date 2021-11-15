import React, { ReactNode } from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import { Descriptions, Divider } from "@arco-design/web-react";
import { IconArrowRight, IconPlus } from "@arco-design/web-react/icon";
import { TypeFileItem } from "src/types/config.page";
import { TypeFileData } from "src/types/file-data";
import { FILE_EVENT, PROTOCOL_TYPE } from "src/common/enums";
import ImageElement from "../../Previewer/ImageElement";
import ImageDisplayFrame from "./ImageDisplayFrame";
import FileHandler from "./FileHandler";
import FileDisplayFrame from "./FileDisplayFrame";
import useSubscribedSrc from "@/hooks/useProjectFile";

// 文件填充器
const FileFiller: React.FC<{
  data: TypeFileItem;
  onFloatClick: () => void;
  onPrimaryClick: () => void;
  onLocate: () => void;
  onImport: () => void;
  onDelete: () => void;
}> = props => {
  const {
    data, //
    onFloatClick,
    onPrimaryClick,
    onLocate,
    onImport,
    onDelete
  } = props;
  const projectFile = useSubscribedSrc(data.sourceData.src);

  const resourceUrl = `${PROTOCOL_TYPE.resource}://${data.sourceData.src}`;

  const ResourceImageDisplay = (
    <ImageDisplayFrame girdSize={16}>
      <ImageElement sourceUrl={resourceUrl} sourceData={data.sourceData} />
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
                  PreviewNode={ResourceImageDisplay}
                />
              }
            >
              {/* 左上角悬浮展示 */}
              <span onClick={onFloatClick}>{ResourceImageDisplay}</span>
            </Tooltip>
          }
          primaryNode={
            <>
              {projectFile.state === FILE_EVENT.UNLINK ? (
                <div className="empty-display" onClick={onImport}>
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
                        ImageNode: ResourceImageDisplay,
                        resolution: getDescription(data.fileData),
                        size: data.fileData.size
                      }}
                      current={{
                        ImageNode: (
                          <ImageDisplayFrame girdSize={18}>
                            <ImageElement
                              shouldSubscribe
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
                    <ImageDisplayFrame girdSize={18} onClick={onPrimaryClick}>
                      <ImageElement
                        mouseEffect
                        shouldSubscribe
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
        locateVisible={!!data.keyPath}
        exportVisible={projectFile.state !== FILE_EVENT.UNLINK}
        deleteVisible={projectFile.state !== FILE_EVENT.UNLINK}
        onLocate={onLocate} // 定位资源
        onImport={onImport} // 导入资源
        onDelete={onDelete} // 删除资源
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
