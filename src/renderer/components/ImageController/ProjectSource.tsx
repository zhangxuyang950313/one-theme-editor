// 图片替换单元组件
import path from "path";
import React, { useContext } from "react";
import { remote } from "electron";
import styled from "styled-components";

import { apiDeleteFile } from "@/api";
import { useProjectRoot } from "@/hooks/project";

import { notification } from "antd";
import ERR_CODE from "@/core/error-code";
import Context from "./Context";
import ImageDisplay from "./ImageDisplay";
import ImageHandler from "./ImageHandler";
import { useCopyReleaseWith } from "./hooks";

const ProjectSource: React.FC = () => {
  const { releaseList, dynamicReleaseList } = useContext(Context);
  const projectRoot = useProjectRoot();
  const copyReleaseWith = useCopyReleaseWith(releaseList, "");

  if (!projectRoot) return null;
  // 更新后的模板绝对路径列表
  const dynamicAbsReleaseList = dynamicReleaseList.map(item =>
    path.join(projectRoot, item)
  );

  // 目标素材绝对路径列表
  const absReleaseList = releaseList.map(item => path.join(projectRoot, item));

  // 筛选一个有效的用于展示
  const absReleaseForShow = dynamicAbsReleaseList[0] || "";

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
    if (!Array.isArray(absReleaseList)) return;
    absReleaseList.forEach((item, index) => {
      setTimeout(() => {
        apiDeleteFile(item).catch(err => {
          notification.warn({
            message: `${ERR_CODE[4007]}${
              err.message ? `（${err.message}）` : ""
            }`,
            description: item
          });
        });
      }, index * 100);
    });
  };

  return (
    <StyleProjectSource>
      <ImageDisplay
        showHandler
        filepath={absReleaseForShow}
        absoluteToList={dynamicAbsReleaseList}
        onClick={() => remote.shell.showItemInFolder(absReleaseForShow)}
      />
      {/* 图片操作 */}
      <ImageHandler
        hiddenDelete={!absReleaseForShow}
        onImport={handleImport}
        onDelete={handleDelete}
      />
    </StyleProjectSource>
  );
};

const StyleProjectSource = styled.div`
  display: flex;
`;

export default ProjectSource;
