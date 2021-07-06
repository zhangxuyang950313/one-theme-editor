import path from "path";
import React from "react";
import styled from "styled-components";
import { remote } from "electron";
import ERR_CODE from "@/core/error-code";
import { notification } from "antd";
import {
  DeleteOutlined,
  // FormOutlined,
  ImportOutlined
} from "@ant-design/icons";
import { apiDeleteFile } from "@/api";
import { asyncQueue } from "common/utils";
import { useProjectPathname } from "@/hooks/project";
import { useCopyReleaseWith } from "./hooks";

// 图片操作区
const ImageHandler: React.FC<{
  releaseList: string[];
  dynamicReleaseList: string[];
}> = props => {
  const { releaseList } = props;
  const copyReleaseWith = useCopyReleaseWith(releaseList, "");
  const projectPathname = useProjectPathname();

  // 目标素材绝对路径列表
  const absReleaseList = projectPathname
    ? releaseList.map(item => path.join(projectPathname, item))
    : [];

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
        copyReleaseWith(result.filePaths[0]);
      });
  };

  // 删除素材
  const handleDelete = () => {
    asyncQueue(absReleaseList.map(item => () => apiDeleteFile(item))).catch(
      err => {
        console.log(err);
        notification.warn({ message: ERR_CODE[4007] });
      }
    );
  };
  return (
    <StyleHandler>
      {/* 导入按钮 */}
      <ImportOutlined className="press import" onClick={handleImport} />
      {/* .9编辑按钮 */}
      {/* <FormOutlined className="press edit" onClick={() => {}} /> */}
      {/* 删除按钮 */}
      {absReleaseList.length && (
        <DeleteOutlined className="press delete" onClick={handleDelete} />
      )}
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
