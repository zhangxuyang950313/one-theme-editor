import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { TypeXmlValueResource } from "src/types/resource";
import { apiWriteXmlTemplate } from "@/request";
import { useProjectUUID } from "@/hooks/project/index";
import { RESOURCE_TYPE, VALUE_RESOURCE_CATEGORY } from "src/enum/index";
import { useResTypeConfigList } from "@/hooks/resource";
import ButtonGroup from "antd/lib/button/button-group";
import ColorPicker from "./ColorPicker";
import BooleanSelector from "./BooleanSelector";
import NumberInput from "./NumberInput";
import StringInput from "./StringInput";
import InfoDisplay from "./InfoDisplay";

// 分类编辑控件
const XmlValueHandlerItem: React.FC<{
  value: string;
  use: VALUE_RESOURCE_CATEGORY;
  onChange: (v: string) => void;
}> = props => {
  const { value, onChange } = props;
  switch (props.use) {
    // 颜色选择器
    case VALUE_RESOURCE_CATEGORY.COLOR: {
      return <ColorPicker value={value} onChange={onChange} />;
    }
    // 布尔选择器
    case VALUE_RESOURCE_CATEGORY.BOOLEAN: {
      return <BooleanSelector value={value} onChange={onChange} />;
    }
    // 数字输入器
    case VALUE_RESOURCE_CATEGORY.NUMBER: {
      return <NumberInput value={value} onChange={onChange} />;
    }
    // 未注明的都使用通用的字符串输入器
    case VALUE_RESOURCE_CATEGORY.STRING:
    default: {
      return <StringInput value={value} onChange={onChange} />;
    }
  }
};

const XmlValueHandler: React.FC<{
  className?: string;
  filterItemTag: string;
  data: TypeXmlValueResource;
}> = props => {
  const { name, sourceData } = props.data;
  const { filterItemTag } = props;
  const uuid = useProjectUUID();
  // const value = useProjectXmlValueBySrc(name, sourceData.src);
  const value = "#f7d2d2";
  const resTypeList = useResTypeConfigList();
  const [tagTypeMap, setTagTypeMap] = useState(
    new Map<string, VALUE_RESOURCE_CATEGORY>()
  );

  // 生成 tag 和 use 映射
  useEffect(() => {
    const map: typeof tagTypeMap = new Map();
    resTypeList.forEach(item => {
      if (item.type !== RESOURCE_TYPE.XML_VALUE) return;
      map.set(item.tag, item.use);
    });
    setTagTypeMap(map);
  }, [resTypeList]);

  if (props.data.items.length === 0) return null;

  const xmlValueList = props.data.items.filter(
    item => item.tag === filterItemTag
  );
  if (xmlValueList.length === 0) return null;
  return (
    <StyleXmlValueHandler className={props.className}>
      <div className="xml-file-info">
        <span className="desc">{props.data.description}</span>
        <span className="file"> | {props.data.sourceData.src}</span>
      </div>
      {xmlValueList.map((item, key) => {
        return (
          <div key={key}>
            <InfoDisplay
              className="xml-value-info"
              title={item.description}
              description={item.name}
            />
            <div className="item">
              <XmlValueHandlerItem
                value={value}
                onChange={value => {
                  // 写入 xml
                  apiWriteXmlTemplate(uuid, {
                    name: item.name,
                    value,
                    src: sourceData.src
                  });
                }}
                use={tagTypeMap.get(item.tag) || VALUE_RESOURCE_CATEGORY.STRING}
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
    </StyleXmlValueHandler>
  );
};

const StyleXmlValueHandler = styled.div`
  flex-shrink: 0;
  box-sizing: content-box;
  .xml-file-info {
    display: inline-block;
    margin-bottom: 20px;
    .desc {
      color: ${({ theme }) => theme["@text-color"]};
      font-size: ${({ theme }) => theme["@text-size-title"]};
    }
    .file {
      color: ${({ theme }) => theme["@text-color-secondary"]};
      font-size: ${({ theme }) => theme["@text-size-secondary"]};
    }
  }
  .xml-value-info {
    display: inline-block;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    padding-bottom: 20px;
    border-bottom: 1px solid;
    border-bottom-color: ${({ theme }) => theme["@border-color-secondary"]};
  }
`;

export default XmlValueHandler;
