import React from "react";
import styled from "styled-components";
import { HEX_FORMAT, LAYOUT_ELEMENT_TAG } from "src/common/enums";

import { filenameIs9Patch } from "src/common/utils";

import NinePatchCanvas from "../NinePatchCanvas";

import { computeLayoutStyle } from "./utils";
import TextElement from "./TextElement";
import ImageElement from "./ImageElement";

import type { TypeLayoutElement } from "src/types/config.page";

const LayoutElement: React.FC<{
  element: TypeLayoutElement;
  ratio: number;
  mouseEffect?: boolean;
  focusKeyPath?: string;
  onClick: () => void;
  onChange: (keyPath: string) => void;
}> = props => {
  const {
    element, // 换行
    ratio,
    mouseEffect,
    focusKeyPath,
    onClick,
    onChange
  } = props;

  let ele: JSX.Element | null = null;
  const layoutStyle = computeLayoutStyle(element.layout, ratio);
  const computedWidth = (Number(element.layout.w) * ratio).toFixed(0);
  const computedHeight = (Number(element.layout.h) * ratio).toFixed(0);
  const sourceUrl = `${element.sourceUrl}?w=${computedWidth}&h=${computedHeight}&q=best`;
  const isBlur = focusKeyPath ? element.keyPath !== focusKeyPath : false;

  switch (element.tag) {
    // 图片类型预览
    case LAYOUT_ELEMENT_TAG.Image: {
      ele = filenameIs9Patch(element.sourceUrl) ? (
        <NinePatchCanvas
          className="image"
          src={element.sourceData.src}
          width={Number(computedWidth)}
          height={Number(computedHeight)}
        />
      ) : (
        <ImageElement
          shouldSubscribe
          mouseEffect={mouseEffect}
          sourceUrl={sourceUrl}
          sourceData={element.sourceData}
          isBlur={isBlur}
          onChange={() => onChange(element.keyPath)}
        />
      );
      break;
    }
    case LAYOUT_ELEMENT_TAG.Text: {
      const fontSize: `${string}px` = `${Number(element.size) * ratio}px`;
      layoutStyle.lineHeight = fontSize;
      ele = (
        <TextElement
          text={element.text}
          fontSize={fontSize}
          valueData={element.valueData}
          sourceData={element.sourceData}
          colorFormat={HEX_FORMAT.ARGB}
          mouseEffect={mouseEffect}
          isBlur={isBlur}
        />
      );
      break;
    }
  }

  return (
    ele && (
      <StyleLayoutElement style={layoutStyle} onClick={onClick}>
        {ele}
      </StyleLayoutElement>
    )
  );
};

const StyleLayoutElement = styled.span`
  cursor: pointer;
  display: inherit;
  transition: all 0.5s;
  box-sizing: border-box;
`;

export default LayoutElement;
