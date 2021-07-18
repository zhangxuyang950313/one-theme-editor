import React, { useEffect, useState } from "react";
import { message } from "antd";
import styled from "styled-components";
import { RightCircleOutlined } from "@ant-design/icons";
import { apiGetTempValueByName, apiOutputXmlTemplate } from "@/request";
import { useProjectUUID, useFileWatcher } from "@/hooks/project";
import { TypeSourceDefine } from "types/source-config";
import ColorUtil, { HEX_TYPES } from "src/core/ColorUtil";
import ColorPicker from "./ColorPicker";
import ColorBox from "./ColorBox";

const XmlController: React.FC<TypeSourceDefine> = sourceDefine => {
  const { name, valueData } = sourceDefine;
  const { defaultValue, valueName, src } = valueData;
  const [defaultColor, setDefaultColor] = useState("");
  const [releaseColor, setReleaseColor] = useState("");
  const uuid = useProjectUUID();

  useFileWatcher(watcher => {
    if (!uuid) return;
    watcher.on(src, file => {
      apiGetTempValueByName({ uuid, name: valueName, src: file })
        .then(value => setReleaseColor(value))
        .catch(err => message.error(err.message));
    });
  });
  useEffect(() => {
    try {
      setDefaultColor(
        new ColorUtil(defaultValue, HEX_TYPES.ARGB).format(HEX_TYPES.RGBA)
      );
    } catch (err) {
      message.warn(err);
    }
  }, [defaultValue]);

  return (
    <StyleXmlController>
      <div className="text-wrapper">
        <span className="name">{name}</span>
        <span className="color-name">{valueName}</span>
      </div>
      <div className="color-wrapper">
        <ColorBox color={defaultColor} />
        <RightCircleOutlined className="middle-button" />
        <ColorPicker
          defaultColor={releaseColor}
          placeholder={defaultColor}
          onDisabled={color => {
            apiOutputXmlTemplate(uuid, {
              name: valueName,
              value: color,
              src: src
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
