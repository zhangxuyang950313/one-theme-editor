import React, { useLayoutEffect } from "react";
import styled from "styled-components";
import { useSafeState } from "ahooks";
import { PROTOCOL_TYPE } from "src/common/enums";

import type { TypeSourceData } from "src/types/config.page";

import { useSubscribeSrc } from "@/hooks/subscribeFile";

const ImageElement: React.FC<{
  sourceUrl: string;
  sourceData: TypeSourceData;
  shouldSubscribe?: boolean;
  mouseEffect?: boolean;
  isBlur?: boolean;
  onChange?: () => void;
}> = props => {
  const [url, setUrl] = useSafeState(props.sourceUrl);
  const {
    mouseEffect, //
    isBlur,
    shouldSubscribe,
    sourceData,
    onChange
  } = props;
  const subscribe = useSubscribeSrc({ immediately: true });
  useLayoutEffect(() => {
    if (!shouldSubscribe) return;
    if (sourceData.protocol === PROTOCOL_TYPE.src || sourceData.protocol === PROTOCOL_TYPE.project) {
      subscribe(sourceData.src, () => {
        const u = new URL(url);
        u.searchParams.set("t", Date.now().toString());
        onChange?.();
        setUrl(u.toString());
      });
    }
  }, []);

  return <StyleImage alt="" src={url} data-is-blur={isBlur} data-mouse-effect={mouseEffect} />;
};

const StyleImage = styled.img`
  display: inherit;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  &[data-mouse-effect="true"] {
    outline: 1px dashed var(--color-primary-light-4);
  }
  &[data-mouse-effect="true"]:hover {
    cursor: pointer;
    opacity: 1;
    filter: drop-shadow(0 0 10px var(--color-primary-light-4));
    outline: 2px dashed var(--color-primary-light-4);
  }
  &[data-is-blur="true"] {
    /* opacity: 0.5; */
    filter: blur(2px);
    outline: none;
    /* outline: 2px dashed var(--color-primary-light-4); */
    transition: all 0.2s ease-out;
  }
`;

export default ImageElement;
