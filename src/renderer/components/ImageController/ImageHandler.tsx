import path from "path";
import React from "react";
import styled from "styled-components";
import { remote } from "electron";
import ERR_CODE from "common/errorCode";
import { notification } from "antd";
import { DeleteOutlined, ImportOutlined } from "@ant-design/icons";
import { apiCopyFile, apiDeleteFile } from "@/request";
import { useProjectPathname } from "@/hooks/project";

// 图片操作区
const ImageHandler: React.FC<{
  src: string;
}> = props => {
  const { src } = props;
  const projectPathname = useProjectPathname();

  const absPath = path.join(projectPathname, src);

  // 手动选取素材
  const handleImport = () => {
    // 选择图片添加
    remote.dialog
      .showOpenDialog({
        title: "选择素材",
        properties: ["openFile", "createDirectory"]
      })
      .then(result => {
        if (result.canceled) return;
        apiCopyFile(result.filePaths[0], absPath);
      });
  };

  // 删除素材
  const handleDelete = () => {
    apiDeleteFile(absPath).catch(err => {
      notification.warn({ message: ERR_CODE[4007] });
    });
  };
  return (
    <StyleHandler>
      {/* 导入按钮 */}
      <ImportOutlined className="press import" onClick={handleImport} />
      {/* .9编辑按钮 */}
      {/* <FormOutlined className="press edit" onClick={() => {}} /> */}
      {/* 删除按钮 */}
      <DeleteOutlined className="press delete" onClick={handleDelete} />
    </StyleHandler>
  );
};

const StyleHandler = styled.div`
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
`;

export default ImageHandler;
