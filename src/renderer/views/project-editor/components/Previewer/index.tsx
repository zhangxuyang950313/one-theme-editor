import React, { useRef, useState } from "react";
import styled from "styled-components";
import { TypePageConfig } from "src/types/config.resource";

import {
  useEditorDispatch,
  useEditorSelector,
  useEditorStore
} from "../../store";
import { ActionSetFocusKeyPath } from "../../store/action";

import LayoutElement from "./LayoutElement";

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
  const dispatch = useEditorDispatch();
  const store = useEditorStore();
  const focusKeyPath = useEditorSelector(state => state.focusKeyPath);
  const [ratio, setRatio] = useState(0);
  const layoutRef = useRef<HTMLDivElement | null>(null);

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
              <LayoutElement
                key={k}
                element={element}
                ratio={ratio}
                mouseEffect={mouseEffect}
                onClick={() => {
                  dispatch(ActionSetFocusKeyPath({ keyPath: element.keyPath }));
                }}
                onChange={keyPath => {
                  if (store.getState().focusKeyPath) {
                    dispatch(
                      ActionSetFocusKeyPath({
                        keyPath: element.keyPath,
                        ignoreDuplicate: true
                      })
                    );
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
