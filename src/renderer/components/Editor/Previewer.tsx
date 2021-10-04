import React, { useState } from "react";
import styled from "styled-components";

import {
  useCurrentResPage,
  useResourceImageUrl,
  useLayoutElementList,
  useCurrentResPageConfig
} from "@/hooks/resource/index";
import {
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  RESOURCE_PROTOCOL,
  RESOURCE_TYPES
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
    case ALIGN_VALUES.CENTER: {
      result.x = Number(data.x) - Number(data.w) / 2;
      break;
    }
    case ALIGN_VALUES.RIGHT: {
      result.x = Number(data.x) - Number(data.w);
      break;
    }
  }
  switch (data.alignV) {
    case ALIGN_V_VALUES.CENTER: {
      result.y = Number(data.y) - Number(data.h) / 2;
      break;
    }
    case ALIGN_V_VALUES.BOTTOM: {
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
            const key = `${element.src}-${k}`;
            switch (element.type) {
              // 图片
              case RESOURCE_TYPES.IMAGE: {
                const layoutComputed = computeLayout(element.layout);
                const fileData = fileDataMap.get(element.src);
                if (fileData?.type === RESOURCE_PROTOCOL.IMAGE) {
                  return (
                    <img
                      key={key}
                      className="image"
                      style={{
                        left: `${layoutComputed.x}px`,
                        top: `${layoutComputed.y}px`,
                        width: `${element.layout.w}px`,
                        height: `${element.layout.h}px`
                      }}
                      alt=""
                      src={fileData.url}
                    />
                  );
                }
                return null;
              }
              // 字体颜色
              case RESOURCE_TYPES.COLOR: {
                return null;
              }
              default:
                return null;
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
