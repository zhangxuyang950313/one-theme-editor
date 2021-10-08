import React, { useState } from "react";
import styled from "styled-components";

import { ALIGN_VALUE, ALIGN_V_VALUE, ELEMENT_TAG } from "src/enum";
import { TypeLayoutData, TypeResPageConfig } from "src/types/resource";
import { DynamicBothSourceImage, PreloadImage } from "../ImageCollection";

function computeLayout(
  data: TypeLayoutData,
  scale: number
): { x: number; y: number; w: number; h: number } {
  const result = {
    x: Number(data.x),
    y: Number(data.y),
    w: Number(data.w),
    h: Number(data.h)
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
  result.x *= scale;
  result.y *= scale;
  result.w *= scale;
  result.h *= scale;
  return result;
}

const Previewer: React.FC<{
  pageConfig: TypeResPageConfig;
  useDash: boolean;
  canClick: boolean;
}> = props => {
  const { screenWidth, layoutElementList, previewList } = props.pageConfig;
  const [scale, setScale] = useState(0);

  if (!screenWidth) return null;

  return (
    <StylePreviewer
      style={{
        borderRadius: `${50 * scale}px`
      }}
      ref={divEl => {
        if (!divEl || scale) return;
        setScale(divEl.getBoundingClientRect().width / Number(screenWidth));
      }}
    >
      {layoutElementList.length ? (
        <div
          className="dynamic"
          style={{
            width: `${Number(screenWidth) * scale}px`,
            height: `${2340 * scale}px`
          }}
        >
          {layoutElementList.map((element, k) => {
            const layoutComputed = computeLayout(element.layout, scale);
            switch (element.tag) {
              // 图片类型预览
              case ELEMENT_TAG.Image: {
                // const fileData = fileDataMap.get(element.src);
                // // 若 fileDataMap 中不存在当前图片，使用默认的 element.url
                // let url = element.url;
                // const fileDataUrl =
                //   fileData?.type === FILE_TYPE.IMAGE ? fileData.url : "";
                // switch (element.protocol) {
                //   // src 协议支持双向寻图
                //   case RESOURCE_PROTOCOL.SRC: {
                //     url = fileDataUrl || element.url;
                //     break;
                //   }
                //   // project 协议强制使用工程图片
                //   // relative | resource | project 协议为相对路径，用于描述静态图片
                //   case RESOURCE_PROTOCOL.PROJECT:
                //   case RESOURCE_PROTOCOL.RELATIVE:
                //   case RESOURCE_PROTOCOL.RESOURCE: {
                //     url = element.url;
                //     break;
                //   }
                //   // TODO: file 文件协议，可用于替换所有文件类型，展示图标图标吧
                //   case RESOURCE_PROTOCOL.FILE: {
                //     break;
                //   }
                // }
                const style = {
                  left: `${layoutComputed.x}px`,
                  top: `${layoutComputed.y}px`,
                  width: `${layoutComputed.w}px`,
                  height: `${layoutComputed.h}px`
                };
                return (
                  <DynamicBothSourceImage
                    key={`${element.src}-${k}`}
                    data-name={element.src}
                    data-dash={props.useDash}
                    data-click={props.canClick}
                    className="image"
                    style={style}
                    alt=""
                    src={element.src}
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
        <PreloadImage className="static" src={`resource://${previewList[0]}`} />
      )}
    </StylePreviewer>
  );
};

const StylePreviewer = styled.div`
  width: 100%;
  border: 1px solid;
  border-color: ${({ theme }) => theme["@border-color-base"]};
  box-sizing: border-box;
  overflow: hidden;
  .dynamic {
    position: relative;
    transform-origin: 0 0;
    .image {
      position: absolute;
      width: 100%;
      transition: transform 0.5s;
      object-fit: cover;
      &[data-dash="true"] {
        border: 1px dashed red;
      }
      &[data-click="true"]:hover {
        cursor: pointer;
        transform: scale(1.2);
        transition: transform 0.3s ease;
      }
    }
    .text {
      position: absolute;
      width: 100%;
    }
  }
`;

export default Previewer;
