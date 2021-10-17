import path from "path";
import React from "react";
import styled from "styled-components";
import ERR_CODE from "src/constant/errorCode";
import { remote } from "electron";
import { notification } from "antd";
import { DeleteOutlined, ImportOutlined } from "@ant-design/icons";
import { apiCopyFile, apiDeleteFile } from "@/request/file";
import { useProjectRoot } from "@/hooks/project/index";

// 图片操作区
const ImageButtons: React.FC<{
  src: string;
}> = props => {
  const { src } = props;
  const projectRoot = useProjectRoot();

  const absPath = path.join(projectRoot, src);

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
        apiCopyFile({ from: result.filePaths[0], to: absPath });
      });
  };

  // 删除素材
  const handleDelete = () => {
    apiDeleteFile(absPath).catch(err => {
      notification.warn({ message: ERR_CODE[4007] });
    });
  };
  return (
    <StyleImageHandler>
      {/* 导入按钮 */}
      <ImportOutlined className="press import" onClick={handleImport} />
      {/* .9编辑按钮 */}
      {/* <FormOutlined className="press edit" onClick={() => {}} /> */}
      {/* 删除按钮 */}
      <DeleteOutlined className="press delete" onClick={handleDelete} />
    </StyleImageHandler>
  );
};

const StyleImageHandler = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 20px;
  margin: 0 10px;
  height: 100%;
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

export default ImageButtons;