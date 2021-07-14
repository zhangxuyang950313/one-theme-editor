import React, { useEffect, useState } from "react";
import { message } from "antd";
import styled from "styled-components";
import { RightCircleOutlined } from "@ant-design/icons";
import { apiGetTempValueByName, apiOutputXmlTemplate } from "@/request";
import { useProjectUUID, useProjectWatcher } from "@/hooks/project";
import { TypeSourceValueElement } from "types/source-config";
import ColorUtil, { HEX_TYPES } from "common/ColorUtil";
import ColorPicker from "./ColorPicker";
import ColorBox from "./ColorBox";

const XmlController: React.FC<TypeSourceValueElement> = sourceConf => {
  const { name, defaultXml, defaultValue, releaseName, releaseXml } =
    sourceConf;
  const [defaultColor, setDefaultColor] = useState("");
  const [releaseColor, setReleaseColor] = useState("");
  const uuid = useProjectUUID();
  useProjectWatcher(releaseXml, () => {
    apiGetTempValueByName({
      uuid,
      name: releaseName,
      releaseXml
    })
      .then(value => setReleaseColor(value))
      .catch(err => message.error(err.message));
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
        <span className="color-name">{releaseName}</span>
      </div>
      <div className="color-wrapper">
        <ColorBox color={defaultColor} />
        <RightCircleOutlined className="middle-button" />
        <ColorPicker
          defaultColor={releaseColor}
          placeholder={defaultColor}
          onChange={color => {
            apiOutputXmlTemplate({
              key: releaseName,
              value: color,
              template: defaultXml,
              releaseXml
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
