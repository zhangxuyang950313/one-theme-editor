import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import { apiWriteXmlTemplate } from "@/request";
import { useProjectUUID } from "@/hooks/project/index";
import { RESOURCE_TAG } from "src/enum/index";
import ButtonGroup from "antd/lib/button/button-group";
import { TypeXmlTypeBlock } from "src/types/resource.page";
import ColorPicker from "./ColorPicker";
import BooleanSelector from "./BooleanSelector";
import NumberInput from "./NumberInput";
import StringInput from "./StringInput";

// 分类编辑控件
const XmlValueItem: React.FC<{
  value: string;
  use: RESOURCE_TAG;
  onChange: (v: string) => void;
}> = props => {
  const { value, onChange } = props;
  switch (props.use) {
    // 颜色选择器
    case RESOURCE_TAG.Color: {
      return <ColorPicker value={value} onChange={onChange} />;
    }
    // 布尔选择器
    case RESOURCE_TAG.Boolean: {
      return <BooleanSelector value={value} onChange={onChange} />;
    }
    // 数字输入器
    case RESOURCE_TAG.Number: {
      return <NumberInput value={value} onChange={onChange} />;
    }
    // 未注明的都使用通用的字符串输入器
    case RESOURCE_TAG.String:
    default: {
      return <StringInput value={value} onChange={onChange} />;
    }
  }
};

const XmlValueBlocker: React.FC<{
  className?: string;
  data: TypeXmlTypeBlock;
}> = props => {
  const uuid = useProjectUUID();
  // const value = useProjectXmlValueBySrc(name, sourceData.src);
  const value = "#f7d2d2";

  return (
    <StyleXmlValueBlock className={props.className}>
      <div className="title-container">
        <span className="title">{props.data.name}</span>
      </div>
      {props.data.items.map((item, key) => {
        return (
          <div key={key}>
            {/* <div className="title-secondary">
              <span className="title">{item.description}</span>
            </div> */}
            {item.items.map((valueItem, valueKey) => {
              return (
                <div className="item-container" key={valueKey}>
                  <div>{valueItem.comment}</div>
                  <div className="item">
                    <XmlValueItem
                      value={value}
                      onChange={value => {
                        // 写入 xml
                        apiWriteXmlTemplate(uuid, {
                          name: item.key,
                          value,
                          src: item.source
                        });
                      }}
                      use={props.data.tag}
                    />
                    <div>
                      <ButtonGroup>
                        <Button type="primary">默认</Button>
                        <Button type="default">删除</Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </StyleXmlValueBlock>
  );
};

const StyleXmlValueBlock = styled.div`
  flex-shrink: 0;
  box-sizing: content-box;
  margin-bottom: 20px;
  .title-container {
    display: inline-block;
    margin-bottom: 20px;
    .title {
      color: ${({ theme }) => theme["@text-color"]};
      font-size: ${({ theme }) => theme["@text-size-title"]};
    }
    .file {
      color: ${({ theme }) => theme["@text-color-secondary"]};
      font-size: ${({ theme }) => theme["@text-size-secondary"]};
    }
  }
  .title-secondary {
    display: inline-block;
    margin-bottom: 20px;
    .title {
      color: ${({ theme }) => theme["@text-color"]};
      font-size: ${({ theme }) => theme["@text-size-main"]};
    }
  }
  .xml-value-info {
    display: inline-block;
  }
  .item-container {
    padding-bottom: 20px;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
      padding-bottom: 20px;
      border-bottom: 1px solid;
      border-bottom-color: ${({ theme }) => theme["@border-color-secondary"]};
    }
  }
`;

export default XmlValueBlocker;
