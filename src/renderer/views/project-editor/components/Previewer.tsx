import React, { useState, useEffect } from "react";
import styled from "styled-components";

import {
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  HEX_FORMAT,
  LAYOUT_ELEMENT_TAG
} from "src/enum";
import { TypePageConfig } from "src/types/resource.config";
import { TypeLayoutData, TypeLayoutTextElement } from "src/types/resource.page";
import ColorUtil from "src/common/utils/ColorUtil";
import { filenameIs9Patch } from "src/common/utils";
import { useEditorSelector } from "@/store/editor";
import useSubscribeFile from "@/hooks/project/useSubscribeFile";
import { DynamicBothSourceImage } from "@/components/ImageCollection";
import NinePatchCanvas from "@/components/NinePatchCanvas";

// function computeLayout(
//   data: TypeLayoutData,
//   scale: number
// ): { x: number; y: number; w: number; h: number } {
//   const result = {
//     x: Number(data.x),
//     y: Number(data.y),
//     w: Number(data.w),
//     h: Number(data.h)
//   };
//   switch (data.align) {
//     case ALIGN_VALUE.CENTER: {
//       result.x = Number(data.x) - Number(data.w) / 2;
//       break;
//     }
//     case ALIGN_VALUE.RIGHT: {
//       result.x = Number(data.x) - Number(data.w);
//       break;
//     }
//   }
//   switch (data.alignV) {
//     case ALIGN_V_VALUE.CENTER: {
//       result.y = Number(data.y) - Number(data.h) / 2;
//       break;
//     }
//     case ALIGN_V_VALUE.BOTTOM: {
//       result.x = Number(data.h) - Number(data.h);
//       break;
//     }
//   }
//   result.x *= scale;
//   result.y *= scale;
//   result.w *= scale;
//   result.h *= scale;
//   return result;
// }

type LayoutStyleComputed = {
  position: "absolute";
  left: `${string}px`;
  top: `${string}px`;
  width: `${string}px` | "auto";
  height: `${string}px` | "auto";
  transform: `translate(${string}, ${string})`;
};

function computeLayoutStyle(
  layout: TypeLayoutData,
  scale: number
): LayoutStyleComputed {
  const style: LayoutStyleComputed = {
    position: "absolute",
    left: `${Number(layout.x) * scale}px`,
    top: `${Number(layout.y) * scale}px`,
    get width(): LayoutStyleComputed["width"] {
      const num = Number(layout.w);
      return num ? `${(num * scale).toFixed(0)}px` : "auto";
    },
    get height(): LayoutStyleComputed["height"] {
      const num = Number(layout.h);
      return num ? `${(num * scale).toFixed(0)}px` : "auto";
    },
    get transform(): LayoutStyleComputed["transform"] {
      let transformX = "0";
      let transformY = "0";
      switch (layout.align) {
        case ALIGN_VALUE.CENTER: {
          transformX = "-50%";
          break;
        }
        case ALIGN_VALUE.RIGHT: {
          transformX = "-100%";
          break;
        }
      }
      switch (layout.alignV) {
        case ALIGN_V_VALUE.CENTER: {
          transformY = "-50%";
          break;
        }
        case ALIGN_V_VALUE.BOTTOM: {
          transformY = "-100%";
          break;
        }
      }
      return `translate(${transformX}, ${transformY})`;
    }
  };
  return style;
}

const LayoutTextElement: React.FC<{
  element: TypeLayoutTextElement;
  scale: number;
  useDash: boolean;
  canClick: boolean;
  colorFormat: HEX_FORMAT;
}> = props => {
  const { element, scale, colorFormat, useDash, canClick } = props;
  const [defaultColor, setDefaultColor] = useState("#000000");
  const [color, setColor] = useState(defaultColor);
  const xmlValMapper = useEditorSelector(state => {
    const data = state.fileDataMap[element.sourceData.src];
    return data?.fileType === "application/xml" ? data.valueMapper : {};
  });

  useSubscribeFile(element.sourceData.src);

  const layoutStyle = computeLayoutStyle(element.layout, scale);

  useEffect(() => {
    try {
      const defColor = element.valueData.value;
      setDefaultColor(ColorUtil.create(defColor, colorFormat).toCssHex());
    } catch (err) {
      //
    }
  }, [element.valueData.value]);

  useEffect(() => {
    const color = xmlValMapper[element.valueData.template];
    if (!color) {
      setColor(defaultColor);
      return;
    }
    try {
      setColor(ColorUtil.create(color, colorFormat).toCssHex());
    } catch (err) {
      setColor(defaultColor);
    }
  }, [xmlValMapper[element.valueData.template]]);

  return (
    <span
      data-dash={useDash}
      data-click={canClick}
      className="text"
      style={{
        ...layoutStyle,
        fontSize: `${Number(element.size) * scale}px`,
        color
      }}
    >
      {element.text}
    </span>
  );
};

const Previewer: React.FC<{
  className?: string;
  pageConfig: TypePageConfig;
  useDash: boolean;
  canClick: boolean;
}> = props => {
  const {
    screenWidth, //
    layoutElementList,
    previewList,
    forceStaticPreview
  } = props.pageConfig;
  const [scale, setScale] = useState(0);

  if (!screenWidth) return null;

  return (
    <StylePreviewer
      className={props.className}
      ref={divEl => {
        if (!divEl || scale) return;
        setScale(divEl.getBoundingClientRect().width / Number(screenWidth));
      }}
    >
      {forceStaticPreview || !layoutElementList.length ? (
        <img alt="" className="static" src={previewList[0]} />
      ) : (
        <div
          className="dynamic"
          style={{
            width: `${Number(screenWidth) * scale}px`,
            height: `${2340 * scale}px`
          }}
        >
          {layoutElementList.map((element, k) => {
            switch (element.elementTag) {
              // 图片类型预览
              case LAYOUT_ELEMENT_TAG.Image: {
                const layoutStyle = computeLayoutStyle(element.layout, scale);
                const computedWidth = layoutStyle.width.replace("px", "");
                const computedHeight = layoutStyle.height.replace("px", "");
                const src = `${element.sourceData.src}?w=${computedWidth}&h=${computedHeight}&q=best`;
                return filenameIs9Patch(element.source) ? (
                  <NinePatchCanvas
                    key={k}
                    className="image"
                    style={layoutStyle}
                    src={element.sourceData.src}
                    width={Number(computedWidth)}
                    height={Number(computedHeight)}
                  />
                ) : (
                  <DynamicBothSourceImage
                    key={k}
                    id={`preview:${src}`}
                    data-dash={props.useDash}
                    data-click={props.canClick}
                    className="image"
                    style={layoutStyle}
                    alt=""
                    src={src}
                  />
                );
              }
              case LAYOUT_ELEMENT_TAG.Text: {
                return (
                  <LayoutTextElement
                    key={k}
                    element={element}
                    scale={scale}
                    colorFormat={props.pageConfig.colorFormat}
                    canClick={props.canClick}
                    useDash={props.useDash}
                  />
                );
              }
              default: {
                return null;
              }
            }
          })}
        </div>
      )}
    </StylePreviewer>
  );
};

const StylePreviewer = styled.div`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme["@border-color-base"]};
  .dynamic {
    position: relative;
    transform-origin: 0 0;
    box-sizing: border-box;
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
      width: 100%;
    }
  }
  .static {
    width: 100%;
  }
`;

export default Previewer;
