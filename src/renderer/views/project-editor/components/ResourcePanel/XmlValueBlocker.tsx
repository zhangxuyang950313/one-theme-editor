import React from "react";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { useCurrentPageConfig } from "@/hooks/resource";
import { useEditorDispatch, useEditorSelector } from "@/store/editor";
import { HEX_FORMAT, RESOURCE_TAG } from "src/enum/index";
import {
  TypeXmlItem,
  TypeXmlBlocker,
  TypeXmlValueTags
} from "src/types/resource.page";
import useSubscribeFile from "@/hooks/project/useSubscribeFile";
import { useProjectAbsolutePath } from "@/hooks/project";
import { ActionPatchFileDataMap } from "@/store/editor/action";
import ColorPicker from "./ColorPicker";
import BooleanSelector from "./BooleanSelector";
import NumberInput from "./NumberInput";
import StringInput from "./StringInput";

// 分类编辑控件
const XmlValueEditor: React.FC<{
  defaultValue: string;
  value: string;
  use: TypeXmlValueTags;
  onChange: (v: string) => void;
}> = props => {
  const { value, defaultValue, onChange } = props;
  const pageConfig = useCurrentPageConfig();

  switch (props.use) {
    // 颜色选择器
    case RESOURCE_TAG.Color: {
      return (
        <ColorPicker
          value={value}
          defaultValue={defaultValue}
          format={pageConfig?.colorFormat || HEX_FORMAT.RGBA}
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
  use: TypeXmlValueTags;
  from: string;
  onChange: (v: string) => void;
}> = props => {
  return (
    <StyleXmlValueItem>
      <div className="info-wrapper">
        <div className="name">{props.comment}</div>
        <div className="file">{props.valueTemplate}</div>
        {/* <div className="file">{props.from}</div> */}
      </div>
      <div className="item">
        <XmlValueEditor
          defaultValue={props.defaultValue}
          value={props.value}
          use={props.use}
          onChange={props.onChange}
        />
        <div className="handle-wrapper">
          {/* 删除 */}
          <CloseOutlined
            className="delete"
            onClick={() => props.onChange("")}
          />
        </div>
      </div>
    </StyleXmlValueItem>
  );
};

const StyleXmlValueItem = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid;
  border-bottom-color: ${({ theme }) => theme["@border-color-secondary"]};
  .info-wrapper {
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
  .handle-wrapper {
    padding-left: 20px;
    border-left: 1px solid;
    border-left-color: ${({ theme }) => theme["@border-color-base"]};
    .delete {
      color: red;
    }
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
    const dispatch = useEditorDispatch();
    const projectPath = useProjectAbsolutePath(xmlItem.sourceData.src);
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
}> = props => {
  // const value = useProjectXmlValueBySrc(name, sourceData.src);
  return (
    <StyleXmlValueBlocker className={props.className}>
      <div className="title-wrapper">
        <span className="name">{props.data.name}</span>
      </div>
      <div className="list">
        {props.data.items.map((xmlItem, key) => (
          <XmlItem key={key} xmlItem={xmlItem} use={props.data.tag} />
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
  .title-wrapper {
    margin-bottom: 20px;
    position: sticky;
    z-index: 2;
    top: 0px;
    padding: 6px 20px;
    background-color: ${({ theme }) => theme["@background-color-thirdly"]};
    .name {
      color: ${({ theme }) => theme["@text-color"]};
      font-size: ${({ theme }) => theme["@text-size-title"]};
    }
  }
  .list {
    padding: 0 30px;
  }
`;

export default XmlValueBlocker;
