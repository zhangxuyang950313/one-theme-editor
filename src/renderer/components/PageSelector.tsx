import React from "react";
import styled from "styled-components";
import { TypePageConfig } from "src/types/config.resource";

import Previewer from "./Previewer";

// 页面选择器
const PageSelector: React.FC<{
  pageSelect: TypePageConfig;
  pageList: TypePageConfig[];
  onChange: (x: TypePageConfig) => void;
}> = props => {
  const { pageSelect, pageList, onChange } = props;

  return (
    <StylePageSelector>
      {pageList.length ? (
        pageList.map((pageConfig, key) => (
          <div
            key={key}
            className="page-preview"
            data-a={pageSelect.config}
            data-b={pageConfig.config}
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
