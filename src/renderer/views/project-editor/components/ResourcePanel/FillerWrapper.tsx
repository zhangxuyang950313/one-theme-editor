import React from "react";
import styled from "styled-components";
import { HEX_FORMAT, RESOURCE_TAG } from "src/common/enums";

import { useRecoilState } from "recoil";

import { selectDataState } from "../../store/rescoil/state";

import FileFiller from "./FileFiller";
import ValueFiller from "./ValueFiller";

import type { TypeBlockCollection } from "src/types/config.page";

// 所有填充器的包装器
// 所有类型及响应都在 switch 处理
const FillerWrapper: React.FC<{
  data: TypeBlockCollection;
}> = props => {
  const { data } = props;
  const [{ focusKeyPath }, setSelectData] = useRecoilState(selectDataState);

  const setFocusKeyPath = (keyPath: string) => {
    setSelectData(state => ({
      ...state,
      // 已选中则取消选中
      focusKeyPath: focusKeyPath === keyPath ? "" : keyPath
    }));
  };

  switch (data.tag) {
    case RESOURCE_TAG.File: {
      return (
        <StyleFileFillerWrapper>
          {data.items.map((item, key) => (
            <div className="file-display__item" key={key}>
              <FileFiller data={item} isFocus={focusKeyPath === item.keyPath} onHighlight={setFocusKeyPath} />
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
              focusKeyPath={focusKeyPath}
              onHighlight={setFocusKeyPath}
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
