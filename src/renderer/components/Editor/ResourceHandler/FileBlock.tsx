import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { remote } from "electron";
import { notification, Tooltip } from "antd";
import {
  DeleteOutlined,
  ImportOutlined,
  UndoOutlined
} from "@ant-design/icons";
import { TypeFileBlock, TypeFileItem } from "src/types/resource.page";
import { apiCopyFile, apiDeleteFile } from "@/request/file";
import { useProjectAbsolutePath } from "@/hooks/project/index";
import { useResourceAbsolutePath } from "@/hooks/resource";
import useSubscribeProjectFile from "@/hooks/project/useSubscribeProjectFile";
import ERR_CODE from "src/constant/errorCode";
import ImageDisplay from "./ImageDisplay";
import InfoDisplay from "./InfoDisplay";

const FileItem: React.FC<{
  className?: string;
  data: TypeFileItem;
}> = props => {
  const { data, className } = props;
  const subscribe = useSubscribeProjectFile();
  const resourcePath = useResourceAbsolutePath(data.sourceData.src);
  const projectPath = useProjectAbsolutePath(data.sourceData.src);
  const [src, setSrc] = useState(`src://${data.sourceData.src}`);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    subscribe(data.sourceData.src, event => {
      setSrc(`src://${data.sourceData.src}?t=${Date.now()}`);
    });
  }, []);

  // setImageSize({
  //   width: ref.naturalWidth,
  //   height: ref.naturalHeight
  // });

  const size = `${imageSize.width}×${imageSize.height}`;
  return (
    <StyleFileItem className={className}>
      <div className="wrapper">
        <ImageDisplay
          className="display"
          src={src}
          onClick={() => {
            // 预览图片
            remote.shell.showItemInFolder(projectPath);
          }}
        />
        <Tooltip
          overlay={
            <>
              <div>路径：{data.sourceData.src}</div>
              <div>
                尺寸：
                {`${size} | ${(data.sourceData.size / 1024).toFixed(2)}px`}
              </div>
            </>
          }
          placement="bottom"
        >
          <InfoDisplay
            className="info"
            title={data.comment || "-"}
            description={size}
          />
        </Tooltip>
      </div>
      <div className="handler">
        {/* 导入按钮 */}
        <ImportOutlined
          className="press import"
          onClick={() => {
            // 选择图片添加
            remote.dialog
              .showOpenDialog({
                title: "选择素材",
                properties: ["openFile", "createDirectory"]
              })
              .then(result => {
                if (result.canceled) return;
                apiCopyFile({
                  from: result.filePaths[0],
                  to: projectPath
                });
              });
          }}
        />
        {/* .9编辑按钮 */}
        {/* <FormOutlined className="press edit" onClick={() => {}} /> */}
        <UndoOutlined
          className="press import"
          onClick={() =>
            apiCopyFile({
              from: resourcePath,
              to: projectPath
            })
          }
        />
        {/* 删除按钮 */}
        <DeleteOutlined
          className="press delete"
          onClick={() => {
            apiDeleteFile(projectPath).catch(err => {
              notification.warn({ message: ERR_CODE[4007] });
            });
          }}
        />
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
    width: 100px;
    .display {
      width: 100%;
      height: 100px;
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
    .import {
      color: ${({ theme }) => theme["@text-color-secondary"]};
    }
    .edit {
      color: ${({ theme }) => theme["@text-color-secondary"]};
    }
    .delete {
      color: red;
    }
  }
`;

const FileBlock: React.FC<{
  className?: string;
  data: TypeFileBlock;
}> = props => {
  const { data, className } = props;

  return (
    <StyleFileBlock className={className}>
      <div className="title-container">
        <span className="title">{props.data.name}</span>
      </div>
      <div className="list">
        {data.items.map((item, key) => (
          <FileItem className="item" key={key} data={item} />
        ))}
      </div>
    </StyleFileBlock>
  );
};

const StyleFileBlock = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid;
  border-bottom-color: ${({ theme }) => theme["@border-color-secondary"]};
  .title-container {
    display: inline-block;
    margin-bottom: 20px;
    .title {
      color: ${({ theme }) => theme["@text-color"]};
      font-size: ${({ theme }) => theme["@text-size-title"]};
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .item {
      margin: 0 20px 20px 0;
    }
  }
`;

export default FileBlock;
