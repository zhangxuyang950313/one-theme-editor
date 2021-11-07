import React from "react";
import styled from "styled-components";
import { IconClose } from "@arco-design/web-react/icon";
import { HEX_FORMAT, RESOURCE_TAG } from "src/enum/index";
import {
  TypeXmlItem,
  TypeXmlBlocker,
  TypeXmlValueTags
} from "src/types/resource.page";
import { resolveProjectPath } from "src/common/utils/pathUtil";
import { xmlElementTextModify } from "src/common/xmlTemplate";
import { ActionPatchFileDataMap } from "../../store/action";
import { useEditorDispatch, useEditorSelector } from "../../store";
import ColorPicker from "./ColorPicker";
import BooleanSelector from "./BooleanSelector";
import NumberInput from "./NumberInput";
import StringInput from "./StringInput";
import StickyTab from "./StickyTab";
import useSubscribeFile from "@/hooks/useSubscribeFile";

// 分类编辑控件
const XmlValueEditor: React.FC<{
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
 * static/comment/5071634098731_.pic.jpg
 * @param props
 * @returns
 */
const XmlValueItem: React.FC<{
  defaultValue: string;
  value: string;
  comment: string;
  valueTemplate: string;
  colorFormat: HEX_FORMAT;
  use: TypeXmlValueTags;
  from: string;
  onChange: (v: string) => void;
}> = props => {
  const {
    defaultValue,
    value,
    comment,
    valueTemplate,
    colorFormat,
    use,
    // from,
    onChange
  } = props;
  return (
    <StyleXmlValueItem>
      <div className="info-wrapper">
        <div className="name">{comment}</div>
        <div className="file">{xmlElementTextModify(valueTemplate, value)}</div>
        {/* <div className="file">{from}</div> */}
      </div>
      <div className="item">
        <XmlValueEditor
          defaultValue={defaultValue}
          value={value}
          colorFormat={colorFormat}
          use={use}
          onChange={onChange}
        />
        <div className="handle-wrapper">
          {/* 删除 */}
          <IconClose className="delete" onClick={() => onChange("")} />
        </div>
      </div>
    </StyleXmlValueItem>
  );
};

const StyleXmlValueItem = styled.div`
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
  .handle-wrapper {
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-left: 1px solid;
    border-left-color: var(--color-secondary-disabled);
    .delete {
      cursor: pointer;
      color: red;
      font-size: 16px;
      &:hover {
        opacity: 0.6;
      }
    }
  }
`;

/**
 * static/comment/5081634098844_.pic.jpg
 * @param props
 * @returns
 */
const XmlItem: React.FC<{
  xmlItem: TypeXmlItem;
  use: TypeXmlValueTags;
  colorFormat: HEX_FORMAT;
}> = props => {
  const { xmlItem, use, colorFormat } = props;
  const dispatch = useEditorDispatch();
  const projectPath = resolveProjectPath(xmlItem.sourceData.src);
  const xmlValMapper = useEditorSelector(state => {
    const data = state.fileDataMap[xmlItem.sourceData.src];
    return data?.fileType === "application/xml" ? data.valueMapper : {};
  });

  useSubscribeFile(xmlItem.sourceData.src, data => {
    window.$server.getFileData(projectPath).then(data => {
      switch (data.fileType) {
        case "image/png":
        case "image/jpeg":
        case "application/xml": {
          dispatch(
            ActionPatchFileDataMap({
              src: xmlItem.sourceData.src,
              fileData: data
            })
          );
          break;
        }
      }
    });
  });

  return (
    <>
      {xmlItem.valueItems.map((valueItem, key) => {
        return (
          <XmlValueItem
            key={key}
            defaultValue={valueItem.value}
            value={xmlValMapper[valueItem.template] || ""}
            valueTemplate={valueItem.template}
            comment={valueItem.comment}
            use={use}
            colorFormat={colorFormat}
            from={xmlItem.sourceData.src}
            onChange={value => {
              // 写入 xml
              window.$server.writeXmlTemplate({
                tag: valueItem.tag,
                attributes: valueItem.attributes,
                value: value,
                src: xmlItem.sourceData.src
              });
            }}
          />
        );
      })}
    </>
  );
};

const XmlValueBlocker: React.FC<{
  className?: string;
  data: TypeXmlBlocker;
  colorFormat: HEX_FORMAT;
}> = props => {
  // const value = useProjectXmlValueBySrc(name, sourceData.src);
  return (
    <StyleXmlValueBlocker className={props.className}>
      <StickyTab content={props.data.name} />
      <div className="list">
        {props.data.items.map((xmlItem, key) => (
          <XmlItem
            key={key}
            xmlItem={xmlItem}
            use={props.data.tag}
            colorFormat={props.colorFormat}
          />
        ))}
      </div>
    </StyleXmlValueBlocker>
  );
};

const StyleXmlValueBlocker = styled.div`
  flex-shrink: 0;
  box-sizing: content-box;
  margin-bottom: 20px;
  padding: 20px 0;
  .list {
    padding: 0 30px;
  }
`;

export default XmlValueBlocker;
