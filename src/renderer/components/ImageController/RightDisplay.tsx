import path from "path";
import React from "react";
import styled from "styled-components";
import { remote } from "electron";
import { useProjectRoot } from "@/hooks/project";
import ImageDisplay from "./ImageDisplay";
import ProjectImageHandler from "./ImageHandler";

/**
 * 工程目录素材显示和操作封装
 * @returns
 */
const RightDisplay: React.FC<{ src: string; url: string }> = props => {
  const { src, url } = props;
  const projectRoot = useProjectRoot();
  const absPath = path.join(projectRoot, props.src);
  return (
    <StyleProjectImage>
      <ImageDisplay
        imageUrl={url}
        onClick={() => remote.shell.showItemInFolder(absPath)}
      />
      {/* 图片操作 */}
      <ProjectImageHandler src={src} />
    </StyleProjectImage>
  );
};

const StyleProjectImage = styled.div`
  display: flex;
`;

export default RightDisplay;
