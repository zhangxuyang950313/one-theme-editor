// 图片替换单元组件
import path from "path";
import React, { useContext } from "react";
import { remote } from "electron";
import styled from "styled-components";

import { apiDeleteFile } from "@/api";
import { useProjectRoot } from "@/hooks/project";

import Context from "./Context";
import ImageDisplay from "./ImageDisplay";
import ImageHandler from "./ImageHandler";
import { useCopyToWith } from "./hooks";

const ProjectSource: React.FC = () => {
  const { toList, dynamicToList } = useContext(Context);
  const projectRoot = useProjectRoot();
  const copyToWith = useCopyToWith(toList, "");

  if (!projectRoot) return null;
  // 更新后的模板绝对路径列表
  const newAbsoluteToList = dynamicToList.map(item =>
    path.join(projectRoot, item)
  );

  // 目标素材绝对路径列表
  const absoluteToList = toList.map(item => path.join(projectRoot, item));

  // 筛选一个有效的用于展示
  const absoluteToForShow = newAbsoluteToList[0] || "";

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
        copyToWith(result.filePaths[0]);
      });
  };
  // 删除素材
  const handleDelete = () => {
    if (!Array.isArray(absoluteToList)) return;
    absoluteToList.forEach((item, index) => {
      setTimeout(() => {
        apiDeleteFile(item);
      }, index * 100);
    });
  };

  return (
    <StyleProjectSource>
      <ImageDisplay
        showHandler
        filepath={absoluteToForShow}
        absoluteToList={newAbsoluteToList}
        onClick={() => remote.shell.showItemInFolder(absoluteToForShow)}
      />
      {/* 图片操作 */}
      <ImageHandler onImport={handleImport} onDelete={handleDelete} />
    </StyleProjectSource>
  );
};

const StyleProjectSource = styled.div`
  display: flex;
`;

export default ProjectSource;
