// 图片替换单元组件
import path from "path";
import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import ERR_CODE from "@/core/error-code";

import { remote } from "electron";
import { apiDeleteFile } from "@/api";
import { useProjectPathname } from "@/hooks/project";

import { notification } from "antd";
import { useImageUrl } from "@/hooks/image";
import { useCopyReleaseWith, useForceUpdateImage } from "./hooks";
import Context from "./Context";
import ImageDisplay from "./ImageDisplay";
import ImageHandler from "./ImageHandler";

/**
 * 封装图片模板列表图片更新
 * @param props
 * @returns
 */
const ProjectImage: React.FC<{
  dynamicAbsReleaseList: string[];
}> = props => {
  const { dynamicAbsReleaseList } = props;
  // 筛选一个有效的用于展示
  const absReleaseForShow = dynamicAbsReleaseList[0] || "";
  const imageUrl = useImageUrl(absReleaseForShow);
  const [url, forceUpdate] = useForceUpdateImage();
  useEffect(() => {
    if (!imageUrl) return;
    forceUpdate(imageUrl);
  }, [dynamicAbsReleaseList]);
  return (
    <ImageDisplay
      imageUrl={url}
      onClick={() => remote.shell.showItemInFolder(absReleaseForShow)}
    />
  );
};

/**
 * 工程目录素材显示和操作封装
 * @returns
 */
const ProjectDisplay: React.FC = () => {
  const { releaseList, dynamicReleaseList } = useContext(Context);
  const projectPathname = useProjectPathname();
  const copyReleaseWith = useCopyReleaseWith(releaseList, "");

  if (!projectPathname) return null;

  const mapToAbsolute = (list: string[]) => {
    return list.map(item => path.join(projectPathname, item));
  };
  // 目标素材绝对路径列表
  const absReleaseList = mapToAbsolute(releaseList);
  // 更新后的模板绝对路径列表
  const dynamicAbsReleaseList = mapToAbsolute(dynamicReleaseList);

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
    <StyleProjectImage>
      <ProjectImage dynamicAbsReleaseList={dynamicAbsReleaseList} />
      {/* 图片操作 */}
      <ImageHandler
        hiddenDelete={!dynamicAbsReleaseList.length}
        onImport={handleImport}
        onDelete={handleDelete}
      />
    </StyleProjectImage>
  );
};

const StyleProjectImage = styled.div`
  display: flex;
`;

export default ProjectDisplay;
