import React, { useState } from "react";
import styled from "styled-components";

import { ALIGN_VALUE, ALIGN_V_VALUE, LAYOUT_ELEMENT_TAG } from "src/enum";
import { TypePageConfig } from "src/types/resource.config";
import { TypeLayoutData } from "src/types/resource.page";
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
  pageConfig: TypePageConfig;
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
            switch (element.tag) {
              // 图片类型预览
              case LAYOUT_ELEMENT_TAG.Image: {
                const layoutComputed = computeLayout(element.layout, scale);
                const style = {
                  left: `${layoutComputed.x}px`,
                  top: `${layoutComputed.y}px`,
                  width: `${layoutComputed.w}px`,
                  height: `${layoutComputed.h}px`
                };
                return (
                  <DynamicBothSourceImage
                    key={k}
                    data-name={element.sourceData.src}
                    data-dash={props.useDash}
                    data-click={props.canClick}
                    className="image"
                    style={style}
                    alt=""
                    src={element.sourceData.src}
                  />
                );
              }
              case LAYOUT_ELEMENT_TAG.Text: {
                const layoutComputed = computeLayout(element.layout, scale);
                const style = {
                  left: `${layoutComputed.x}px`,
                  top: `${layoutComputed.y}px`,
                  width: `${layoutComputed.w}px`,
                  height: `${layoutComputed.h}px`
                };
                return (
                  <span
                    key={k}
                    data-name={element.text}
                    data-dash={props.useDash}
                    data-click={props.canClick}
                    className="text"
                    style={{
                      ...style,
                      fontSize: `${Number(element.size) * scale}px`
                    }}
                  >
                    {element.text}
                  </span>
                );
              }
              default: {
                return null;
              }
            }
          })}
        </div>
      ) : (
        <PreloadImage className="static" src={previewList[0]} />
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
  .static {
    width: 100%;
  }
`;

export default Previewer;
