import path from "path";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { remote } from "electron";
import { notification, Tooltip } from "antd";
import {
  DeleteOutlined,
  ImportOutlined,
  UndoOutlined
} from "@ant-design/icons";
import { TypeFileBlocker, TypeFileItem } from "src/types/resource.page";
import { useEditorDispatch, useEditorSelector } from "@/store/editor";
import { useProjectAbsolutePath } from "@/hooks/project/index";
import useSubscribeFile from "@/hooks/project/useSubscribeFile";
import ERR_CODE from "src/constant/errorCode";
import { ActionPatchFileDataMap } from "@/store/editor/action";
import ImageDisplay from "./ImageDisplay";
import InfoDisplay from "./InfoDisplay";

const FileItem: React.FC<{
  className?: string;
  data: TypeFileItem;
}> = props => {
  const { data, className } = props;
  const dispatch = useEditorDispatch();
  const projectPath = useProjectAbsolutePath(data.sourceData.src);
  const [src, setSrc] = useState(data.sourceData.src);
  const fileData = useEditorSelector(state => {
    return state.fileDataMap[data.sourceData.src];
  });

  useSubscribeFile(data.sourceData.src, () => {
    setSrc(`${data.sourceData.src}?t=${Date.now()}`);
    window.$server.getFileData(projectPath).then(fileData => {
      switch (fileData.fileType) {
        case "image/png":
        case "image/jpeg":
        case "application/xml": {
          dispatch(ActionPatchFileDataMap({ src, fileData }));
          break;
        }
      }
    });
  });

  // TODO 为何不响应切换
  useEffect(() => {
    setSrc(data.sourceData.src);
  }, [data]);

  let size = "";
  switch (data.fileData.fileType) {
    case "image/webp":
    case "image/jpeg":
    case "image/gif":
    case "image/png": {
      size = `${data.fileData.width}×${data.fileData.height}`;
      break;
    }
    default: {
      size = `${(data.fileData.size / 1024).toFixed(2)}kb`;
      break;
    }
  }
  return (
    <StyleFileItem className={className}>
      <div className="wrapper">
        <ImageDisplay
          className="display"
          src={`project://${src}`}
          girdSize={17}
          useDash={!!fileData}
          onClick={() => {
            // 预览图片
            remote.shell.showItemInFolder(projectPath);
          }}
        />
        <ImageDisplay
          className="resource"
          girdSize={10}
          src={`resource://${data.sourceData.src}`}
        />
        {/* <Tooltip
          overlay={
            <>
              <div>路径：{data.sourceData.src}</div>
              <div>
                尺寸：
                {`${size} | ${(data.fileData.size / 1024).toFixed(2)}kb`}
              </div>
            </>
          }
          placement="bottom"
        >
        </Tooltip> */}
        <InfoDisplay
          className="info"
          main={data.comment || "-"}
          secondary={size}
        />
      </div>
      <div className="handler">
        <Tooltip overlay="导入" placement="right">
          {/* 导入按钮 */}
          <ImportOutlined
            className="press btn-normal"
            onClick={() => {
              // 选择图片添加
              remote.dialog
                .showOpenDialog({
                  title: "选择素材",
                  properties: ["openFile", "createDirectory"]
                })
                .then(result => {
                  if (result.canceled) return;
                  window.$server.copyFile({
                    from: result.filePaths[0],
                    to: projectPath
                  });
                });
            }}
          />
        </Tooltip>
        {/* .9编辑按钮 */}
        {/* <FormOutlined className="press edit" onClick={() => {}} /> */}
        {/* 恢复默认按钮 */}
        <Tooltip overlay="默认" placement="right">
          <UndoOutlined
            className="press btn-reset"
            onClick={() => {
              const resourcePath = path.join(
                window.$reactiveProjectState.get("resourcePath"),
                data.sourceData.src
              );
              window.$server.copyFile({
                from: resourcePath,
                to: projectPath
              });
            }}
          />
        </Tooltip>
        {/* 删除按钮 */}
        <Tooltip overlay="删除" placement="right">
          <DeleteOutlined
            className="press btn-delete"
            onClick={() => {
              window.$server.deleteFile(projectPath).catch(err => {
                notification.warn({ message: ERR_CODE[4007] });
              });
            }}
          />
        </Tooltip>
      </div>
    </StyleFileItem>
  );
};

const StyleFileItem = styled.div`
  display: flex;
  /* 图标和操作悍妞 */
  .wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100px;
    .resource {
      position: absolute;
      left: -5px;
      top: -5px;
      width: 30px;
      height: 30px;
      border-radius: 3px;
      border: 1px dashed red;
    }
    .display {
      cursor: pointer;
      width: 100%;
      height: 100px;
      border-radius: 10px;
    }
  }
  .info {
    margin: 5px 0;
  }
  .handler {
    display: flex;
    flex-direction: column;
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
      color: ${({ theme }) => theme["@text-color-secondary"]};
    }
    .btn-delete {
      color: red;
    }
    .btn-reset {
      color: green;
    }
  }
`;

const FileBlocker: React.FC<{
  className?: string;
  data: TypeFileBlocker;
}> = props => {
  const { data, className } = props;

  return (
    <StyleFileBlocker className={className}>
      <div className="title-container">
        <span className="title">{data.name}</span>
      </div>
      <div className="list">
        {data.items.map((item, key) => (
          <FileItem className="item" key={key} data={item} />
        ))}
      </div>
    </StyleFileBlocker>
  );
};

const StyleFileBlocker = styled.div`
  margin-bottom: 20px;
  padding: 20px 0;
  .title-container {
    z-index: 2;
    position: sticky;
    top: 0px;
    padding: 6px 20px;
    background-color: ${({ theme }) => theme["@background-color-thirdly"]};
    margin-bottom: 20px;
    border-bottom: 1px solid;
    border-bottom-color: ${({ theme }) => theme["@border-color-thirdly"]};
    .title {
      color: ${({ theme }) => theme["@text-color"]};
      font-size: ${({ theme }) => theme["@text-size-title"]};
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    padding: 0 30px;
    .item {
      margin: 0 20px 20px 0;
    }
  }
`;

export default FileBlocker;
