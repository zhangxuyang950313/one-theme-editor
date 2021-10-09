import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { remote } from "electron";
import { notification, Tooltip } from "antd";
import {
  DeleteOutlined,
  ImportOutlined,
  UndoOutlined
} from "@ant-design/icons";
import { TypeImageResource, TypeImageResourceItem } from "src/types/resource";
import { FILE_EVENT } from "src/enum";
import { apiCopyFile, apiDeleteFile } from "@/request/file";
import { useAbsolutePathInProject } from "@/hooks/project/index";
import { useAbsolutePathInRes } from "@/hooks/resource";
import useSubscribeProjectFile from "@/hooks/project/useSubscribeProjectFile";
import ERR_CODE from "src/constant/errorCode";
import ImageDisplay from "./ImageDisplay";
import InfoDisplay from "./InfoDisplay";

const ImageHandlerItem: React.FC<{
  className?: string;
  data: TypeImageResourceItem;
}> = props => {
  const { data, className } = props;
  const subscribe = useSubscribeProjectFile();
  const absPathInSource = useAbsolutePathInRes(data.sourceData.src);
  const absPathInProject = useAbsolutePathInProject(data.sourceData.src);
  const [src, setSrc] = useState(`src://${data.sourceData.src}`);

  useEffect(() => {
    subscribe(data.sourceData.src, event => {
      if (event === FILE_EVENT.UNLINK) {
        setSrc("");
        return;
      }
      setSrc(`src://${data.sourceData.src}?t=${Date.now()}`);
    });
  }, []);

  const size = `${data.sourceData.data.width}×${data.sourceData.data.height}`;
  return (
    <StyleImageHandlerList className={className}>
      <div className="wrapper">
        <ImageDisplay
          className="display"
          src={src}
          onClick={() => {
            // 预览图片
            remote.shell.showItemInFolder(absPathInProject);
          }}
        />
        <Tooltip
          overlay={
            <>
              <div>路径：{data.sourceData.src}</div>
              <div>
                尺寸：
                {`${size} | ${(data.sourceData.data.size / 1024).toFixed(2)}px`}
              </div>
            </>
          }
          placement="bottom"
        >
          <InfoDisplay
            className="info"
            title={data.description || "-"}
            description={size || "?×?"}
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
                  to: absPathInProject
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
              from: absPathInSource,
              to: absPathInProject
            })
          }
        />
        {/* 删除按钮 */}
        <DeleteOutlined
          className="press delete"
          onClick={() => {
            apiDeleteFile(absPathInProject).catch(err => {
              notification.warn({ message: ERR_CODE[4007] });
            });
          }}
        />
      </div>
    </StyleImageHandlerList>
  );
};

const StyleImageHandlerList = styled.div`
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

const ImageHandler: React.FC<{
  className?: string;
  data: TypeImageResource;
}> = props => {
  const { data, className } = props;

  return (
    <StyleImageHandler className={className}>
      <div className="image-category-info">
        <span className="desc">{props.data.description}</span>
      </div>
      <div className="image-handler-list">
        {data.items.map((item, key) => {
          return <ImageHandlerItem className="item" key={key} data={item} />;
        })}
      </div>
    </StyleImageHandler>
  );
};

const StyleImageHandler = styled.div`
  .image-category-info {
    display: inline-block;
    margin-bottom: 20px;
    .desc {
      color: ${({ theme }) => theme["@text-color"]};
      font-size: ${({ theme }) => theme["@text-size-title"]};
    }
  }
  .image-handler-list {
    display: flex;
    flex-wrap: wrap;
    .item {
      margin: 0 20px 20px 0;
    }
  }
`;

export default ImageHandler;
