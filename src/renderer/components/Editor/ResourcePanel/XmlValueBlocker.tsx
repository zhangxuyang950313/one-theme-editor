import React, { useEffect } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { apiGetProjectFileData, apiWriteXmlTemplate } from "@/request";
import { useProjectUUID } from "@/hooks/project/index";
import { RESOURCE_TAG } from "src/enum/index";
import {
  TypeXmlItem,
  TypeXmlBlocker,
  TypeXmlValueTags,
  TypeXmlValueItem
} from "src/types/resource.page";
import useSubscribeProjectFile from "@/hooks/project/useSubscribeProjectFile";
import XMLNodeElement from "src/server/compiler/XMLNodeElement";
import XmlCompilerExtra from "src/server/compiler/XmlCompilerExtra";
import ColorPicker from "./ColorPicker";
import BooleanSelector from "./BooleanSelector";
import NumberInput from "./NumberInput";
import StringInput from "./StringInput";

// 分类编辑控件
const XmlValueEditor: React.FC<{
  value: string;
  use: TypeXmlValueTags;
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

/**
 *
 * static/comment/5071634098731_.pic.jpg
 * @param props
 * @returns
 */
const XmlValueItem: React.FC<{
  value: string;
  comment: string;
  use: TypeXmlValueTags;
  from: string;
  onChange: (v: string) => void;
}> = props => {
  return (
    <StyleXmlValueItem>
      <div className="info-container">
        <div className="name">{props.comment}</div>
        <div className="file">{props.from}</div>
      </div>
      <div className="item">
        <XmlValueEditor
          value={props.value}
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
  margin-bottom: 20px;
  border-bottom: 1px solid;
  border-bottom-color: ${({ theme }) => theme["@border-color-secondary"]};
  .info-container {
    display: inline-block;
    .name {
      color: ${({ theme }) => theme["@text-color"]};
      font-size: ${({ theme }) => theme["@text-size-big"]};
    }
    .file {
      color: ${({ theme }) => theme["@text-color-secondary"]};
      font-size: ${({ theme }) => theme["@text-size-main"]};
    }
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    /* margin-bottom: 20px; */
  }
`;

/**
 * static/comment/5081634098844_.pic.jpg
 * @param props
 * @returns
 */
const XmlItem: React.FC<{ xmlItem: TypeXmlItem; use: TypeXmlValueTags }> =
  props => {
    const { xmlItem, use } = props;
    const uuid = useProjectUUID();
    const subscribe = useSubscribeProjectFile();

    const genValWeakMap = async () => {
      const fileData = await apiGetProjectFileData(xmlItem.sourceData.src);
      console.log(fileData);
      if (fileData.fileType !== "application/xml") return;
      const xmlTemp = new XmlCompilerExtra(fileData.element);
      const weakMap = xmlItem.valueItems.reduce<
        WeakMap<TypeXmlValueItem, string>
      >((prev, item) => {
        const value = xmlTemp.findTextByTagAndAttributes(
          item.tag,
          item.attributes
        );
        prev.set(item, value);
        return prev;
      }, new WeakMap());
      console.log(weakMap);
      return weakMap;
    };

    useEffect(() => {
      subscribe(
        xmlItem.sourceData.src,
        { immediately: true },
        async (event, data) => {
          console.log(1, xmlItem.sourceData.src);
          console.log(data);
          // genValWeakMap();
        }
      );
    }, []);

    return (
      <>
        {xmlItem.valueItems.map((valueItem, key) => (
          <XmlValueItem
            key={key}
            value={valueItem.value}
            comment={valueItem.comment}
            use={use}
            from={xmlItem.sourceData.src}
            onChange={value => {
              // 写入 xml
              apiWriteXmlTemplate(uuid, {
                tag: valueItem.tag,
                attributes: valueItem.attributes,
                value: value,
                src: xmlItem.sourceData.src
              });
            }}
          />
        ))}
      </>
    );
  };

const XmlValueBlocker: React.FC<{
  className?: string;
  data: TypeXmlBlocker;
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
