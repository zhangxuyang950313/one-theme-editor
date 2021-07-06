// 图片替换单元组件
import path from "path";
import React, { useEffect } from "react";
import styled from "styled-components";
import { remote } from "electron";
import { useImageUrl } from "@/hooks/image";
import { useProjectPathname } from "@/hooks/project";
import { useForceUpdateImage } from "./hooks";
import ImageDisplay from "./ImageDisplay";
import ImageHandler from "./ImageHandler";

/**
 * 封装图片模板列表图片更新
 * @param props
 * @returns
 */
const ProjectImage: React.FC<{
  dynamicReleaseList: string[];
}> = props => {
  const { dynamicReleaseList } = props;
  const projectPathname = useProjectPathname();
  const dynamicAbsReleaseList = projectPathname
    ? dynamicReleaseList.map(item => path.join(projectPathname, item))
    : [];
  const absPath = dynamicAbsReleaseList[0] || "";
  const imageUrl = useImageUrl(absPath);
  const [url, forceUpdate] = useForceUpdateImage(imageUrl);

  useEffect(() => {
    forceUpdate();
  }, [dynamicReleaseList]);

  return (
    <ImageDisplay
      imageUrl={url}
      onClick={() => remote.shell.showItemInFolder(absPath)}
    />
  );
};

/**
 * 工程目录素材显示和操作封装
 * @returns
 */
const RightDisplay: React.FC<{
  releaseList: string[];
  dynamicReleaseList: string[];
}> = props => {
  const { releaseList, dynamicReleaseList } = props;

  return (
    <StyleProjectImage>
      <ProjectImage dynamicReleaseList={dynamicReleaseList} />
      {/* 图片操作 */}
      <ImageHandler
        releaseList={releaseList}
        dynamicReleaseList={dynamicReleaseList}
      />
    </StyleProjectImage>
  );
};

const StyleProjectImage = styled.div`
  display: flex;
`;

export default RightDisplay;
