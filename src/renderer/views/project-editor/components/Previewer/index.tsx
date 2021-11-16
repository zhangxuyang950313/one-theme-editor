import React, { useLayoutEffect, useRef, useState } from "react";
import anime from "animejs";
import styled from "styled-components";
import { TypePageConfig } from "src/types/config.resource";

import LayoutElement from "./LayoutElement";

import { previewResourceEmitter, PREVIEW_EVENT } from "@/singletons/emitters";

const Previewer: React.FC<{
  className?: string;
  mouseEffect?: boolean;
  pageConfig: TypePageConfig;
}> = props => {
  const {
    className,
    mouseEffect,
    pageConfig: {
      screenWidth,
      layoutElementList,
      previewList,
      forceStaticPreview
    }
  } = props;

  const [ratio, setRatio] = useState(0);
  const layoutRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const cb = (keyPath: string) => {
      console.log(keyPath);
      const list = Array.from(layoutRef.current?.children || []);
      const targets = list.flatMap(child =>
        child.getAttribute("data-key-path") !== keyPath ? [child] : []
      );
      if (targets.length === list.length) return;
      anime({
        targets,
        opacity: 0.1,
        direction: "alternate",
        duration: 800,
        easing: "easeOutBack"
      });
    };
    previewResourceEmitter.on(PREVIEW_EVENT.locateLayout, cb);
    return () => {
      previewResourceEmitter.removeListener(PREVIEW_EVENT.locateLayout, cb);
    };
  }, []);

  if (!screenWidth) return null;

  return (
    <StylePreviewer
      className={className}
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
              <span key={k} data-key-path={element.keyPath}>
                <LayoutElement
                  element={element}
                  ratio={ratio}
                  mouseEffect={mouseEffect}
                  onClick={() => {
                    previewResourceEmitter.emit(
                      PREVIEW_EVENT.locateResource,
                      element.keyPath
                    );
                  }}
                />
              </span>
            );
          })}
        </div>
      )}
    </StylePreviewer>
  );
};

const StylePreviewer = styled.div`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--color-secondary);
  .dynamic {
    width: 100%;
    position: relative;
    box-sizing: border-box;
  }
  .static {
    width: 100%;
  }
`;

export default Previewer;
