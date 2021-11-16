import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TypePageConfig } from "src/types/config.resource";

import Previewer from "./Previewer/index";

const selectedMap = new Map<string, number>();

// 页面选择器
const PageSelector: React.FC<{
  className?: string;
  pageConfigList: TypePageConfig[];
  onChange: (x: TypePageConfig) => void;
}> = props => {
  const { pageConfigList, onChange } = props;

  const selectedKey = pageConfigList.map(_ => _.config).join("");

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(selectedMap.get(selectedKey) || 0);
  }, [pageConfigList]);

  useEffect(() => {
    selectedMap.set(selectedKey, index);
    if (pageConfigList[index]) {
      onChange(pageConfigList[index]);
    }
  }, [index]);

  return (
    <StylePageSelector className={props.className}>
      {pageConfigList.map((pageConfig, key) => (
        <span
          key={key}
          data-active={index === key}
          className="preview"
          onClick={() => setIndex(key)}
        >
          <Previewer className="previewer" pageConfig={pageConfig} />
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
    margin-top: 10px;
    &:last-child {
      margin-bottom: 10px;
    }
    padding: 2px;
    opacity: 0.4;
    box-sizing: border-box;
    outline: 1px solid;
    border-radius: 6px;
    &[data-active="true"] {
      outline-color: rgb(var(--primary-6));
      opacity: 1;
    }
    .previewer {
      border-radius: 6px;
      /* overflow: hidden; */
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
