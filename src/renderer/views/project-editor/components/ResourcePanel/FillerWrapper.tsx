import React from "react";
import styled from "styled-components";
import { HEX_FORMAT, RESOURCE_TAG } from "src/enum";
import { TypeBlockCollection } from "src/types/config.page";
import FileFiller from "./FileFiller";
import ValueFiller from "./ValueFiller";

const FillerWrapper: React.FC<{ data: TypeBlockCollection }> = props => {
  const { data } = props;
  switch (data.tag) {
    case RESOURCE_TAG.File: {
      return (
        <StyleFileFillerWrapper>
          {data.items.map((item, key) => (
            <div className="item" key={key}>
              <FileFiller data={item} />
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
  .item {
    margin: 0 20px 20px 0;
  }
`;

// 值填充器
const StyleValueFillerWrapper = styled.div`
  flex-shrink: 0;
  padding: 20px 30px;
`;

export default FillerWrapper;
