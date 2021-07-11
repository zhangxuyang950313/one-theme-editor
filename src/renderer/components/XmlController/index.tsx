import React from "react";
import styled from "styled-components";
import { Tooltip, Input } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { SketchPicker } from "react-color";
import { TypeSourceValueElement } from "types/source-config";
import { StyleGirdBackground } from "@/style";

const XmlController: React.FC<TypeSourceValueElement> = sourceConf => {
  return (
    <StyleXmlController>
      <div className="text-wrapper">
        <span className="name">{sourceConf.name}</span>
        <span className="color-name">{sourceConf.valueName}</span>
      </div>
      <div className="color-wrapper">
        <Tooltip title={sourceConf.defaultValue}>
          <StyleColorBox color={sourceConf.defaultValue} />
        </Tooltip>
        <RightCircleOutlined className="middle-button" />
        <Tooltip
          overlayInnerStyle={{ color: "black" }}
          trigger="click"
          color="transparent"
          arrowPointAtCenter={true}
          // placement="left"
          overlay={
            <SketchPicker
              presetColors={[]}
              color={"#ffffffff"}
              disableAlpha={true}
              // onChange={color => updateColor(color)}
            />
          }
        >
          <StyleColorBox
            color="#ff000066"
            // color={props.defaultColor}
            // onClick={() => setPickerVisible(!pickerVisible)}
          />
        </Tooltip>
        <Input className="color-input" placeholder="请填写颜色值" allowClear />
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
  .color-input {
    height: 100%;
    margin: 0 10px;
  }
`;

const StyleColorBox = styled(StyleGirdBackground)<{ color: string }>`
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 3px solid;
  border-color: ${({ theme }) => theme["@border-color-base"]};
  box-sizing: border-box;
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background-color: ${({ color }) => color};
  }
`;

export default XmlController;
