import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RightCircleOutlined } from "@ant-design/icons";
import { TypeSourceValueElement } from "types/source-config";
import { projectPrefixRegexp } from "common/regexp";
import { useProjectFileWatcher } from "@/hooks/fileWatcher";
import { apiGetTempValueByName } from "@/api";
import ColorPicker from "./ColorPicker";
import ColorBox from "./ColorBox";

const XmlController: React.FC<TypeSourceValueElement> = sourceConf => {
  const { name, defaultValue, valueName, valueChannel } = sourceConf;
  const [value, setValue] = useState(sourceConf.defaultValue);
  useEffect(() => {
    console.log(sourceConf);
  }, []);
  useProjectFileWatcher(
    valueChannel.replace(projectPrefixRegexp, ""),
    template => {
      apiGetTempValueByName({
        name: valueName,
        template
      }).then(value => {
        setValue(value);
      });
    }
  );
  return (
    <StyleXmlController>
      <div className="text-wrapper">
        <span className="name">{name}</span>
        <span className="color-name">{valueName}</span>
      </div>
      <div className="color-wrapper">
        <ColorBox color={defaultValue} />
        <RightCircleOutlined className="middle-button" />
        <ColorPicker
          defaultColor={value || defaultValue}
          onChange={() => {
            //
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
