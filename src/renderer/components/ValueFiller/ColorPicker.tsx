import React, { useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { RgbaObject } from "hex-rgb";
import { Tooltip } from "antd";
import { Input, Message } from "@arco-design/web-react";
import { IconRight } from "@arco-design/web-react/icon";
import { RGBColor, SketchPicker } from "react-color";
import ColorUtil, { HEX_FORMAT } from "src/common/utils/ColorUtil";
// import * as electronStore from "src/store";

import { StyleGirdBackground } from "@/style";

// 颜色小方块
const ColorBox: React.FC<{
  color: string;
  tipColor: string;
  onClick?: () => void;
}> = props => {
  const { color, tipColor, onClick } = props;
  return (
    <Tooltip title={tipColor}>
      <StyleColorBox
        girdSize={10}
        color={color}
        onClick={() => onClick && onClick()}
      />
    </Tooltip>
  );
};
const StyleColorBox = styled(StyleGirdBackground)<{ color: string }>`
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  display: inline-block;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 3px solid;
  border-color: ${({ color }) =>
    color ? "var(--color-secondary-disabled)" : "transparent"};
  box-sizing: border-box;
  &::before {
    content: "×";
    position: absolute;
    color: var(--color-text-2);
    font-size: 25px;
    width: 100%;
    height: 100%;
    line-height: 100%;
    text-align: center;
  }
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background-color: ${({ color }) => color || "transparent"};
  }
`;

// rgba 和 react-color-picker 数据互转
// const rgba2sketch = (rgba: RgbaObject): RGBColor => {
//   const { red, green, blue, alpha } = rgba;
//   return { a: alpha, r: red, g: green, b: blue };
// };
const sketch2rgba = (sketch: RGBColor): RgbaObject => {
  const { r, g, b, a } = sketch;
  return { alpha: a ?? 1, red: r, green: g, blue: b };
};

// 颜色选择器
function ColorPickerBox(props: {
  color: string; // RGBAHex
  tipColor: string;
  colorFormat: HEX_FORMAT;
  onChange?: (color: string) => void;
  onDisabled?: (color: string) => void;
}): JSX.Element {
  const { color, colorFormat, tipColor, onChange, onDisabled } = props;
  const [colorRGBAHex, setColorRGBAHex] = useState(color);
  const [colorRecently, setColorRecently] = useState<string[]>([]);

  useEffect(() => {
    setColorRGBAHex(color);
  }, [color]);

  const appendColorRecently = () => {
    // const colorRecently = electronStore.config.get("colorRecently");
    // const colorRecently = [];
    if (!Array.isArray(colorRecently)) {
      // electronStore.config.set("colorRecently", []);
      return;
    }
    const arr = Array.from(new Set([colorRGBAHex, ...colorRecently])).filter(
      item => {
        try {
          ColorUtil.create(item, colorFormat);
          return true;
        } catch (err) {
          return false;
        }
      }
    );
    if (arr.length > 55) {
      arr.length = 55;
    }
    // electronStore.config.set("colorRecently", arr);
    setColorRecently(arr);
  };

  useEffect(() => {
    appendColorRecently();
  }, []);

  return (
    <StyleColorPickerBox>
      <Tooltip
        overlayInnerStyle={{
          color: "black",
          width: "320px",
          boxSizing: "border-box"
        }}
        trigger="click"
        color="transparent"
        arrowPointAtCenter={true}
        // placement="left"
        overlay={
          <SketchPicker
            width="auto"
            presetColors={colorRecently}
            color={colorRGBAHex}
            onChange={({ rgb }) => {
              const rgba = sketch2rgba(rgb);
              const rgbaHex = ColorUtil.rgba(rgba).toRGBAHex();
              setColorRGBAHex(rgbaHex);
              onChange && onChange(rgbaHex);
            }}
          />
        }
        onVisibleChange={visible => {
          if (!visible) appendColorRecently();
          !visible && onDisabled && onDisabled(colorRGBAHex);
        }}
      >
        <ColorBox color={colorRGBAHex} tipColor={tipColor} />
      </Tooltip>
    </StyleColorPickerBox>
  );
}

const StyleColorPickerBox = styled.div`
  display: flex;
  align-items: center;
  position: inline-block;
`;

// 颜色值选择器
const ColorPicker: React.FC<{
  value: string;
  defaultValue: string;
  colorFormat: HEX_FORMAT;
  onChange: (x: string) => void;
}> = props => {
  const { value, defaultValue, colorFormat, onChange } = props;
  const [defaultColor, setDefaultColor] = useState("");
  const [colorRGBAHex, setColorRGBAHex] = useState("");
  const [inputColor, setInputColor] = useState("");

  const resetColor = () => {
    if (inputColor !== "") setInputColor("");
    if (colorRGBAHex !== "") setColorRGBAHex("");
  };

  // 生成默认 formatter 规定的颜色
  useLayoutEffect(() => {
    try {
      setDefaultColor(ColorUtil.create(defaultValue, colorFormat).toRGBAHex());
    } catch (err: any) {
      console.log(err);
      Message.warning(`默认颜色格式错误"${defaultValue}"`);
    }
  }, [defaultValue]);

  // 生成 formatter 规定的颜色
  useLayoutEffect(() => {
    try {
      setColorRGBAHex(ColorUtil.create(value, colorFormat).toRGBAHex());
      setInputColor(value);
    } catch (err: any) {
      // console.log("value", err);
      resetColor();
    }
  }, [value]);

  // 选色器和输入框联动
  useLayoutEffect(() => {
    try {
      setInputColor(
        ColorUtil.create(colorRGBAHex, HEX_FORMAT.RGBA).format(colorFormat)
      );
    } catch (err: any) {
      // console.log("colorRGBAHex", err);
      // message.warn(err.message);
    }
  }, [colorRGBAHex]);

  // 输入框与选色器联动
  useLayoutEffect(() => {
    try {
      setColorRGBAHex(ColorUtil.create(inputColor, colorFormat).toRGBAHex());
    } catch (err: any) {
      setColorRGBAHex("");
      // console.log("inputColor", err);
    }
  }, [inputColor]);

  // 在输入框失焦触发变更
  const onInputBlur = (val: string) => {
    try {
      if (val !== "") {
        setColorRGBAHex(ColorUtil.create(val, colorFormat).toRGBAHex());
      }
      onChange(val);
    } catch (err: any) {
      setInputColor(value);
      Message.warning(err.message);
    }
  };

  return (
    <StyleColorPicker>
      <div className="content-wrapper">
        <ColorBox color={defaultColor} tipColor={defaultValue} />
        <Tooltip title="恢复默认">
          <IconRight
            className="middle-button"
            onClick={() => {
              if (value !== defaultValue) {
                onChange(defaultValue);
              }
            }}
          />
        </Tooltip>
        <ColorPickerBox
          color={colorRGBAHex}
          tipColor={inputColor}
          colorFormat={colorFormat}
          onDisabled={() => {
            if (value !== inputColor) {
              onChange(inputColor);
            }
          }}
          onChange={setColorRGBAHex}
        />
        <Input
          value={inputColor}
          className="color-input"
          defaultValue={inputColor}
          placeholder={defaultValue}
          onChange={value => setInputColor(value)}
          onBlur={e => {
            if (value !== e.target.value) {
              onInputBlur(e.target.value);
            }
          }}
        />
      </div>
      {!ColorUtil.isHex(value) && value.length > 0 && (
        <div className="error">{`非合法颜色值("${value}")`}</div>
      )}
    </StyleColorPicker>
  );
};

const StyleColorPicker = styled.div`
  display: flex;
  flex-direction: column;
  /* .info {
    margin-bottom: 10px;
  } */
  .content-wrapper {
    display: flex;
    align-items: center;
    .middle-button {
      cursor: pointer;
      color: var(--color-text-3);
      font-size: 22px;
      margin: 10px;
      transition: all 0.3s;
      &:hover {
        opacity: 0.5;
      }
    }
    .color-input {
      width: 120px;
      height: 36px;
      margin: 0 10px;
      border-radius: 6px;
    }
  }
  .error {
    color: rgb(var(--red-5));
    font-size: 11px;
  }
`;

export default ColorPicker;
