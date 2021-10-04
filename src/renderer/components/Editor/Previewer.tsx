import React, { useState } from "react";
import styled from "styled-components";

import {
  useCurrentResPage,
  useResourceImageUrl,
  useLayoutElementList,
  useCurrentResPageConfig
} from "@/hooks/resource/index";
import {
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  ELEMENT_TAG,
  FILE_TYPE,
  RESOURCE_PROTOCOL
} from "src/enum";
import { useFileDataMap } from "@/hooks/project";
import { TypeLayoutData } from "src/types/resource";
import { PreloadImage } from "../ImageCollection";

function computeLayout(data: TypeLayoutData): { x: number; y: number } {
  const result: { x: number; y: number } = {
    x: Number(data.x),
    y: Number(data.y)
  };
  switch (data.align) {
    case ALIGN_VALUE.CENTER: {
      result.x = Number(data.x) - Number(data.w) / 2;
      break;
    }
    case ALIGN_VALUE.RIGHT: {
      result.x = Number(data.x) - Number(data.w);
      break;
    }
  }
  switch (data.alignV) {
    case ALIGN_V_VALUE.CENTER: {
      result.y = Number(data.y) - Number(data.h) / 2;
      break;
    }
    case ALIGN_V_VALUE.BOTTOM: {
      result.x = Number(data.h) - Number(data.h);
      break;
    }
  }
  return result;
}

const Previewer: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [currentPage] = useCurrentResPage();
  const currentPageConfig = useCurrentResPageConfig();
  const layoutElementList = useLayoutElementList();
  const imageUrl = useResourceImageUrl(currentPage.preview || "");
  const fileDataMap = useFileDataMap();

  const screenWidth = currentPageConfig?.screenWidth;

  if (!screenWidth) return null;

  return (
    <StylePreviewer
      ref={divEl => {
        if (!divEl) return;
        setScale(divEl.getClientRects()[0].width / Number(screenWidth));
      }}
    >
      {layoutElementList.length ? (
        <div
          className="preview-dynamic"
          style={{
            width: `${screenWidth}px`,
            height: `${2340}px`,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
            borderRadius: `${16 / scale}px`
          }}
        >
          {layoutElementList.map((element, k) => {
            const layoutComputed = computeLayout(element.layout);
            switch (element.tag) {
              // 图片类型预览
              case ELEMENT_TAG.Image: {
                const fileData = fileDataMap.get(element.src);
                // 若 fileDataMap 中不存在当前图片，使用默认的 element.url
                let url = element.url;
                const fileDataUrl =
                  fileData?.type === FILE_TYPE.IMAGE ? fileData.url : "";
                switch (element.protocol) {
                  // src 协议支持双向寻图
                  case RESOURCE_PROTOCOL.SRC: {
                    url = fileDataUrl || element.url;
                    break;
                  }
                  // project 协议强制使用工程图片
                  case RESOURCE_PROTOCOL.PROJECT: {
                    url = fileDataUrl;
                    break;
                  }
                  // relative | resource 协议为相对路径，用于描述静态图片
                  case RESOURCE_PROTOCOL.RELATIVE:
                  case RESOURCE_PROTOCOL.RESOURCE: {
                    url = element.url;
                    break;
                  }
                  // TODO: file 文件协议，可用于替换所有文件类型，展示图标图标吧
                  case RESOURCE_PROTOCOL.FILE: {
                    break;
                  }
                }
                const style = {
                  left: `${layoutComputed.x}px`,
                  top: `${layoutComputed.y}px`,
                  width: `${element.layout.w}px`,
                  height: `${element.layout.h}px`
                };
                return (
                  <PreloadImage
                    key={`${element.src}-${k}`}
                    className="image"
                    style={style}
                    alt=""
                    src={url}
                  />
                );
              }
              default: {
                return null;
              }
            }
          })}
        </div>
      ) : (
        <PreloadImage className="preview-static" src={imageUrl} />
      )}
    </StylePreviewer>
  );
};

const StylePreviewer = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* 动态预览 */
  .preview-dynamic {
    position: relative;
    border: 1px solid;
    border-color: ${({ theme }) => theme["@border-color-base"]};
    box-sizing: border-box;
    overflow: hidden;
    .image {
      position: absolute;
      width: 100%;
    }
    .text {
      position: absolute;
      width: 100%;
    }
  }
  /* 静态预览图 */
  .preview-static {
    width: 100%;
    border: 1px solid;
    border-color: ${({ theme }) => theme["@border-color-base"]};
  }
`;

export default Previewer;
