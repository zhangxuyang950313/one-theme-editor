import path from "path";
import React, { useEffect } from "react";
import styled from "styled-components";
import { remote } from "electron";
import { useImageUrl, useForceUpdateImageUrl } from "@/hooks/image";
import { useProjectPathname } from "@/hooks/project";
import ImageDisplay from "./ImageDisplay";
import ProjectImageHandler from "./ImageHandler";

/**
 * 封装图片模板列表图片更新
 * @param props
 * @returns
 */
const ProjectImageDisplay: React.FC<{ src: string }> = props => {
  const projectPathname = useProjectPathname();
  const absPath = path.join(projectPathname, props.src);
  const imageUrl = useImageUrl(absPath);
  const [url, forceUpdate] = useForceUpdateImageUrl(imageUrl);

  useEffect(() => {
    forceUpdate();
  }, [absPath]);

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
const RightDisplay: React.FC<{ src: string }> = props => {
  const { src } = props;
  return (
    <StyleProjectImage>
      <ProjectImageDisplay src={src} />
      {/* 图片操作 */}
      <ProjectImageHandler src={src} />
    </StyleProjectImage>
  );
};

const StyleProjectImage = styled.div`
  display: flex;
`;

export default RightDisplay;
