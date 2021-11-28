import React, { useState } from "react";
import styled from "styled-components";
import { HEX_FORMAT, RESOURCE_TAG } from "src/common/enums/index";
import { TypeXmlNodeData, TypeXmlValueTags } from "src/types/config.page";
import { TypeXmlFileData } from "src/types/file-data";
import XmlTemplateUtil from "src/common/utils/XmlTemplateUtil";

import ColorPicker from "@/components/ValueFiller/ColorPicker";
import BooleanSelector from "@/components/ValueFiller/BooleanSelector";
import NumberInput from "@/components/ValueFiller/NumberInput";
import StringInput from "@/components/ValueFiller/StringInput";
import ValueHandler from "@/components/ValueFiller/ValueHandler";

import { useSubscribeSrcSingly } from "@/hooks/subscribeFile";
import { useEditorSelector } from "@/views/project-editor/store";

// 分类编辑控件
const ValueEditor: React.FC<{
  defaultValue: string;
  value: string;
  use: TypeXmlValueTags;
  colorFormat: HEX_FORMAT;
  onChange: (v: string) => void;
}> = props => {
  const { value, defaultValue, colorFormat, onChange } = props;

  switch (props.use) {
    // 颜色选择器
    case RESOURCE_TAG.Color: {
      return (
        <ColorPicker
          value={value}
          defaultValue={defaultValue}
          colorFormat={colorFormat}
          onChange={onChange}
        />
      );
    }
    // 布尔选择器
    case RESOURCE_TAG.Boolean: {
      return <BooleanSelector value={value} onChange={onChange} />;
    }
    // 数字输入器
    case RESOURCE_TAG.Number: {
      return (
        <NumberInput
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
        />
      );
    }
    // 未注明的都使用通用的字符串输入器
    case RESOURCE_TAG.String:
    default: {
      return (
        <StringInput
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
        />
      );
    }
  }
};

/**
 *
 * comment/5071634098731_.pic.jpg
 * @param props
 * @returns
 */
const ValueFillerItem: React.FC<{
  keyPath: string;
  defaultValue: string;
  value: string;
  comment: string;
  valueTemplate: string;
  colorFormat: HEX_FORMAT;
  use: TypeXmlValueTags;
  from: string;
  onChange: (v: string) => void;
  onLocate: () => void;
  iconEyeFocus: boolean;
}> = props => {
  const {
    keyPath,
    comment,
    valueTemplate,
    defaultValue,
    value,
    colorFormat,
    use,
    onChange,
    onLocate,
    iconEyeFocus
  } = props;
  return (
    <StyleValueFillerItem>
      <div className="info-wrapper">
        <div className="name">{comment}</div>
        <div className="file">
          {XmlTemplateUtil.xmlElementTextModify(valueTemplate, value)}
        </div>
        {/* <div className="file">{from}</div> */}
      </div>
      <div className="item">
        <ValueEditor
          defaultValue={defaultValue}
          value={value}
          use={use}
          colorFormat={colorFormat}
          onChange={onChange}
        />

        <ValueHandler
          locateVisible={!!keyPath}
          deleteVisible
          onLocate={onLocate}
          onDelete={() => onChange("")}
          iconEyeFocus={iconEyeFocus}
        />
      </div>
    </StyleValueFillerItem>
  );
};

const StyleValueFillerItem = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid;
  border-bottom-color: var(--color-secondary-disabled);
  .info-wrapper {
    display: inline-block;
    .name {
      color: var(--color-text-2);
      font-size: 16px;
    }
    .file {
      color: var(--color-text-3);
      font-size: 14px;
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
 * comment/5081634098844_.pic.jpg
 * @param props
 * @returns
 */
const ValueFiller: React.FC<{
  xmlItem: TypeXmlNodeData;
  use: TypeXmlValueTags;
  colorFormat: HEX_FORMAT;
  onHighlight: (keyPath: string) => void;
}> = props => {
  const { xmlItem, use, colorFormat, onHighlight } = props;
  // const xmlValMapper = useEditorSelector(state => {
  //   const data = state.fileDataMap[xmlItem.sourceData.src];
  //   return data?.fileType === "application/xml" ? data.valueMapper : {};
  // });
  const [xmlFileData, setXmlFileData] = useState<TypeXmlFileData>();
  const focusKeyPath = useEditorSelector(state => state.focusKeyPath);

  useSubscribeSrcSingly(xmlItem.sourceData.src, (event, src, fileData) => {
    if (fileData.filetype === "application/xml") {
      setXmlFileData(fileData);
    }
  });

  if (!xmlFileData) return null;

  const { valueMapper } = xmlFileData;

  return (
    <>
      {xmlItem.valueItems.map((valueItem, key) => {
        const value = valueMapper[valueItem.template] || "";
        return (
          <ValueFillerItem
            key={key}
            keyPath={valueItem.keyPath}
            defaultValue={valueItem.value}
            value={value}
            valueTemplate={valueItem.template}
            comment={valueItem.comment}
            use={use}
            colorFormat={colorFormat}
            from={xmlItem.sourceData.src}
            onLocate={() => onHighlight(valueItem.keyPath)}
            onChange={val => {
              if (value === val) return;
              // 写入 xml
              window.$one.$server.writeXmlTemplate({
                tag: valueItem.tag,
                attributes: valueItem.attributes,
                value: val,
                src: xmlItem.sourceData.src
              });
            }}
            iconEyeFocus={focusKeyPath === valueItem.keyPath}
          />
        );
      })}
    </>
  );
};

export default ValueFiller;
