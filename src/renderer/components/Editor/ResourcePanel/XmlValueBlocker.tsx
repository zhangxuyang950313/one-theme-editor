import React, { useEffect } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { apiWriteXmlTemplate } from "@/request";
import { useProjectUUID } from "@/hooks/project/index";
import { RESOURCE_TAG } from "src/enum/index";
import {
  TypeXmlItem,
  TypeXmlTypeBlock,
  TypeXmlTypeTags,
  TypeXmlValueItem
} from "src/types/resource.page";
import useSubscribeProjectFile from "@/hooks/project/useSubscribeProjectFile";
import ColorPicker from "./ColorPicker";
import BooleanSelector from "./BooleanSelector";
import NumberInput from "./NumberInput";
import StringInput from "./StringInput";

// 分类编辑控件
const XmlValueEditor: React.FC<{
  value: string;
  use: TypeXmlTypeTags;
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

const XmlValueItem: React.FC<{
  data: TypeXmlValueItem;
  use: TypeXmlTypeTags;
  from: string;
  onChange: (v: string) => void;
}> = props => {
  return (
    <StyleXmlValueItem>
      <div className="value-name-container">
        <div className="name">{props.data.comment}</div>
        <div className="file">{props.from}</div>
      </div>
      <div className="value-item">
        <XmlValueEditor
          value={props.data.value}
          use={props.use}
          onChange={props.onChange}
        />
        <div>
          <Button.Group>
            <Button type="primary">默认</Button>
            <Button type="default">删除</Button>
          </Button.Group>
        </div>
      </div>
    </StyleXmlValueItem>
  );
};

const StyleXmlValueItem = styled.div`
  padding-bottom: 20px;
  .value-name-container {
    display: inline-block;
    .name {
      color: ${({ theme }) => theme["@text-color"]};
    }
    .file {
      color: ${({ theme }) => theme["@text-color-secondary"]};
      font-size: ${({ theme }) => theme["@text-size-secondary"]};
    }
  }
  .value-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    padding-bottom: 20px;
    border-bottom: 1px solid;
    border-bottom-color: ${({ theme }) => theme["@border-color-secondary"]};
  }
`;

const XmlItem: React.FC<{ xmlItem: TypeXmlItem; use: TypeXmlTypeTags }> =
  props => {
    const uuid = useProjectUUID();
    const subscribe = useSubscribeProjectFile({ ignoreInitial: false });
    useEffect(() => {
      subscribe(xmlItem.sourceData.src, () => {
        console.log(1, xmlItem.sourceData.src);
      });
    }, []);

    const { xmlItem, use } = props;
    return (
      <>
        {xmlItem.valueItems.map((valueItem, key) => (
          <XmlValueItem
            key={key}
            data={valueItem}
            use={use}
            from={xmlItem.sourceData.src}
            onChange={value => {
              // 写入 xml
              apiWriteXmlTemplate(uuid, {
                attributes: valueItem.attributes,
                value,
                src: xmlItem.source
              });
            }}
          />
        ))}
      </>
    );
  };

const XmlValueBlocker: React.FC<{
  className?: string;
  data: TypeXmlTypeBlock;
}> = props => {
  // const value = useProjectXmlValueBySrc(name, sourceData.src);

  return (
    <StyleXmlValueBlocker className={props.className}>
      <div className="title-container">
        <span className="name">{props.data.name}</span>
      </div>
      {props.data.items.map((xmlItem, key) => (
        <XmlItem key={key} xmlItem={xmlItem} use={props.data.tag} />
      ))}
    </StyleXmlValueBlocker>
  );
};

const StyleXmlValueBlocker = styled.div`
  flex-shrink: 0;
  box-sizing: content-box;
  margin-bottom: 20px;
  margin-right: 20px;
  .title-container {
    display: inline-block;
    margin-bottom: 20px;
    .name {
      color: ${({ theme }) => theme["@text-color"]};
      font-size: ${({ theme }) => theme["@text-size-title"]};
    }
  }
`;

export default XmlValueBlocker;
