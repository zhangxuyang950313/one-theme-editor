import React from "react";
import styled from "styled-components";
import { HEX_FORMAT, RESOURCE_TAG } from "src/common/enums";
import { TypeBlockCollection } from "src/types/config.page";

import { useEditorDispatch, useEditorSelector } from "../../store";

import { ActionSetFocusKeyPath } from "../../store/action";

import FileFiller from "./FileFiller/index";
import ValueFiller from "./ValueFiller/index";

// 所有填充器的包装器
// 所有类型及响应都在 switch 处理
const FillerWrapper: React.FC<{
  data: TypeBlockCollection;
}> = props => {
  const { data } = props;
  const dispatch = useEditorDispatch();
  const focusKeyPath = useEditorSelector(state => state.focusKeyPath);
  switch (data.tag) {
    case RESOURCE_TAG.File: {
      return (
        <StyleFileFillerWrapper>
          {data.items.map((item, key) => (
            <div className="file-display__item" key={key}>
              <FileFiller
                data={item}
                isFocus={focusKeyPath === item.keyPath}
                onHighlight={keyPath => {
                  dispatch(ActionSetFocusKeyPath({ keyPath }));
                }}
              />
            </div>
          ))}
        </StyleFileFillerWrapper>
      );
    }
    case RESOURCE_TAG.String:
    case RESOURCE_TAG.Number:
    case RESOURCE_TAG.Color:
    case RESOURCE_TAG.Boolean: {
      return (
        <StyleValueFillerWrapper>
          {data.items.map((xmlItem, key) => (
            <ValueFiller
              key={key}
              xmlItem={xmlItem}
              use={data.tag}
              colorFormat={HEX_FORMAT.ARGB}
              onHighlight={keyPath => {
                dispatch(ActionSetFocusKeyPath({ keyPath }));
              }}
            />
          ))}
        </StyleValueFillerWrapper>
      );
    }
    default: {
      return null;
    }
  }
};

// 文件填充器
const StyleFileFillerWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px 30px;
  .file-display__item {
    margin: 0 20px 20px 0;
  }
`;

// 值填充器
const StyleValueFillerWrapper = styled.div`
  flex-shrink: 0;
  padding: 20px 30px;
`;

export default FillerWrapper;
