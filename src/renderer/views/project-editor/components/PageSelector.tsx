import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TypePageConfig } from "src/types/resource.config";
import Previewer from "./Previewer";

// 页面选择器
const PageSelector: React.FC<{
  className?: string;
  defaultSelected?: TypePageConfig;
  pageConfigList: TypePageConfig[];
  onChange: (x: TypePageConfig) => void;
}> = props => {
  const { pageConfigList, defaultSelected, onChange } = props;

  const [selectedIndex, setIndex] = useState(0);

  useEffect(() => {
    if (!defaultSelected) return;
    const index = pageConfigList.findIndex(
      item => item.config === defaultSelected.config
    );
    if (index >= 0) setIndex(index);
  }, []);

  return (
    <StylePageSelector className={props.className}>
      {pageConfigList.map((pageConfig, index) => (
        <span
          key={index}
          data-active={selectedIndex === index}
          className="preview"
          onClick={() => {
            setIndex(index);
            onChange(pageConfig);
          }}
        >
          <Previewer
            className="previewer"
            pageConfig={pageConfig}
            useDash={false}
            canClick={false}
          />
        </span>
      ))}
    </StylePageSelector>
  );
};

const StylePageSelector = styled.div`
  display: flex;
  flex-direction: column;
  .preview {
    cursor: pointer;
    width: 100%;
    margin: 5px 0;
    padding: 2px;
    opacity: 0.4;
    border-radius: 6px;
    box-sizing: border-box;
    border: 1px solid;
    &[data-active="true"] {
      border-color: rgb(var(--primary-6));
      opacity: 1;
    }
    .previewer {
      border-radius: 6px;
      overflow: hidden;
      box-sizing: border-box;
    }
    .preview-image {
      border-radius: 6px;
      overflow: hidden;
      text-align: center;
      object-fit: cover;
    }
  }
`;

export default PageSelector;
