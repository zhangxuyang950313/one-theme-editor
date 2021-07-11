import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RightCircleOutlined } from "@ant-design/icons";
import { apiGetTempValueByName, apiOutputXmlTemplate } from "@/api";
import {
  useResolveProjectPath,
  useProjectWatcher,
  useResolveSourcePath
} from "@/hooks/project";
import { TypeSourceValueElement } from "types/source-config";
import ColorUtil, { HEX_TYPES } from "common/ColorUtil";
import ColorPicker from "./ColorPicker";
import ColorBox from "./ColorBox";

const XmlController: React.FC<TypeSourceValueElement> = sourceConf => {
  const { name, template, defaultValue, valueName, release } = sourceConf;
  const [value, setValue] = useState(sourceConf.defaultValue);
  const releaseFile = useResolveProjectPath(release);
  const templateFile = useResolveSourcePath(template);

  useProjectWatcher(release, () => {
    console.log(11, releaseFile);
    apiGetTempValueByName({
      name: valueName,
      template: releaseFile
    }).then(value => {
      setValue(value);
    });
  });
  return (
    <StyleXmlController>
      <div className="text-wrapper">
        <span className="name">{name}</span>
        <span className="color-name">{valueName}</span>
      </div>
      <div className="color-wrapper">
        <ColorBox
          color={
            defaultValue
              ? new ColorUtil(defaultValue, HEX_TYPES.ARGB).format(
                  HEX_TYPES.RGBA
                )
              : "#ffffff"
          }
        />
        <RightCircleOutlined className="middle-button" />
        <ColorPicker
          defaultColor={value || defaultValue}
          onChange={color => {
            apiOutputXmlTemplate({
              key: valueName,
              value: color,
              template,
              release: releaseFile
            });
          }}
        />
      </div>
    </StyleXmlController>
  );
};

const StyleXmlController = styled.div`
  margin-bottom: 20px;
  flex-shrink: 0;
  box-sizing: content-box;
  .text-wrapper {
    display: flex;
    flex-direction: column;
    .name {
      font-size: ${({ theme }) => theme["@text-size-main"]};
      color: ${({ theme }) => theme["@text-color"]};
    }
    .color-name {
      user-select: text;
      margin: 5px 0;
      font-size: ${({ theme }) => theme["@text-size-secondary"]};
      color: ${({ theme }) => theme["@text-color-secondary"]};
    }
  }
  .color-wrapper {
    display: flex;
    align-items: center;
  }
  .middle-button {
    cursor: pointer;
    color: ${({ theme }) => theme["@text-color-secondary"]};
    font-size: 22px;
    margin: 10px;
    transition: all 0.3s;
    &:hover {
      opacity: 0.5;
    }
  }
`;

export default XmlController;
