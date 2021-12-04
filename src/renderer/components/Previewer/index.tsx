import React, { useRef, useState } from "react";
import styled from "styled-components";
import { TypePageConfig } from "src/types/config.resource";

import LayoutElement from "./LayoutElement";

const Previewer: React.FC<{
  mouseEffect?: boolean;
  focusKeyPath?: string;
  pageConfig: TypePageConfig;
  onSelect?: (keyPath: string) => void;
}> = props => {
  const {
    mouseEffect,
    focusKeyPath,
    pageConfig: {
      screenWidth,
      layoutElementList,
      previewList,
      forceStaticPreview
    },
    onSelect
  } = props;
  const [ratio, setRatio] = useState(0);
  const layoutRef = useRef<HTMLDivElement | null>(null);

  if (!screenWidth)
    return (
      <StylePreviewer>
        <div className="no-config">无配置</div>
      </StylePreviewer>
    );

  return (
    <StylePreviewer
      ref={divEl => {
        if (!divEl || ratio) return;
        setRatio(divEl.getBoundingClientRect().width / Number(screenWidth));
      }}
    >
      {!ratio || forceStaticPreview || !layoutElementList.length ? (
        <img alt="" className="static" src={previewList[0]} />
      ) : (
        <div
          ref={layoutRef}
          className="dynamic"
          style={{
            width: `${Number(screenWidth) * ratio}px`,
            height: `${2340 * ratio}px`
          }}
        >
          {layoutElementList.map((element, k) => {
            return (
              <LayoutElement
                key={k}
                element={element}
                ratio={ratio}
                mouseEffect={mouseEffect}
                focusKeyPath={focusKeyPath}
                onClick={() => {
                  if (focusKeyPath === element.keyPath) {
                    onSelect?.("");
                  } else {
                    onSelect?.(element.keyPath);
                  }
                }}
                onChange={keyPath => {
                  if (keyPath !== focusKeyPath && !!focusKeyPath) {
                    onSelect?.(keyPath);
                  }
                }}
              />
            );
          })}
        </div>
      )}
    </StylePreviewer>
  );
};

const StylePreviewer = styled.div`
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  outline: 1px solid var(--color-secondary);
  .dynamic {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    background-color: black;
  }
  .static {
    width: 100%;
  }
  .no-config {
    width: 100%;
    height: 100%;
    margin: auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-4);
  }
`;

export default Previewer;
