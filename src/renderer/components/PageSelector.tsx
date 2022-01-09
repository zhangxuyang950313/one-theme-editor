import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import Previewer from "./Previewer";

import type { TypePageConfig } from "src/types/config.resource";

// 页面选择器
const PageSelector: React.FC<{
  pageSelect: TypePageConfig;
  pageList: TypePageConfig[];
  onChange: (x: TypePageConfig) => void;
}> = props => {
  const { pageSelect, pageList, onChange } = props;
  const pageConfigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pageConfigRef.current
      ?.querySelector("div[data-active='true']")
      ?.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
  }, [pageConfigRef.current, pageSelect.config]);

  return (
    <StylePageSelector ref={pageConfigRef}>
      {pageList.length ? (
        pageList.map((pageConfig, key) => (
          <div
            key={key}
            className="page-preview"
            data-config={pageSelect.config}
            data-active={String(pageSelect.config === pageConfig.config)}
            onClick={() => onChange(pageConfig)}
          >
            <div className="preview-container">
              <Previewer pageConfig={pageConfig} />
            </div>
          </div>
        ))
      ) : (
        <div className="no-config">无配置</div>
      )}
    </StylePageSelector>
  );
};

const StylePageSelector = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: var(--color-text-2);
  .page-preview {
    cursor: pointer;
    width: 100%;
    flex-shrink: 0;
    margin-bottom: 10px;
    padding: 3px;
    opacity: 0.4;
    box-sizing: border-box;
    border: 1px solid;
    border-radius: 6px;
    overflow: hidden;
    &[data-active="true"] {
      border-color: rgb(var(--primary-6));
      opacity: 1;
    }
    .preview-container {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      overflow: hidden;
      box-sizing: border-box;
    }
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

export default PageSelector;
