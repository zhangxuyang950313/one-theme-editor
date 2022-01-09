import React, { useState, useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import ColorUtil from "src/common/utils/ColorUtil";
import { HEX_FORMAT } from "src/common/enums";

import type { TypeSourceData, TypeXmlValueData } from "src/types/config.page";

import { useSubscribeSrc } from "@/hooks/subscribeFile";

const TextElement: React.FC<{
  text: string;
  fontSize: `${string}px`;
  colorFormat: HEX_FORMAT;
  sourceData: TypeSourceData;
  valueData: TypeXmlValueData;
  mouseEffect?: boolean;
  isBlur?: boolean;
}> = props => {
  const { text, fontSize, valueData, sourceData, colorFormat, mouseEffect, isBlur } = props;
  const [defaultColor, setDefaultColor] = useState("");
  const [color, setColor] = useState(defaultColor);
  const [valMapper, setValMapper] = useState<Record<string, string>>({});
  const subscribe = useSubscribeSrc({ immediately: true });

  useLayoutEffect(() => {
    if (!sourceData.src) return;
    subscribe(sourceData.src, (event, src, fileData) => {
      if (fileData.filetype === "application/xml" && fileData.valueMapper) {
        setValMapper(fileData.valueMapper);
      }
    });
  }, []);

  useEffect(() => {
    try {
      const defColor = valueData.value;
      setDefaultColor(ColorUtil.create(defColor, colorFormat).toCssHex());
    } catch (err) {
      //
    }
  }, [valueData.value]);

  useEffect(() => {
    const color = valMapper?.[valueData.template];
    if (!color) {
      setColor(defaultColor);
      return;
    }
    try {
      setColor(ColorUtil.create(color, colorFormat).toCssHex());
    } catch (err) {
      setColor(defaultColor);
    }
  }, [valMapper?.[valueData.template]]);

  return (
    <StyleSpan data-mouse-effect={mouseEffect} data-is-blur={isBlur} style={{ display: "inherit", fontSize, color }}>
      {text}
    </StyleSpan>
  );
};

const StyleSpan = styled.span`
  word-break: keep-all;
  margin: 1px;
  &[data-mouse-effect="true"] {
    outline: 1px dashed var(--color-primary-light-4);
  }
  &[data-mouse-effect="true"]:hover {
    cursor: pointer;
    filter: drop-shadow(0 0 10px var(--color-primary-light-4));
    outline: 2px solid var(--color-primary-light-4);
    transition: all 0.3s ease;
  }
  &[data-is-blur="true"] {
    opacity: 0.5;
    filter: blur(2px);
    outline: none;
    transition: all 0.2s ease-out;
  }
`;

export default TextElement;
