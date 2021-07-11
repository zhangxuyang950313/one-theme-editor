import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RgbaObject } from "hex-rgb";

import { Input, message, Tooltip } from "antd";
import { RGBColor, SketchPicker } from "react-color";
import { isHex } from "common/utils";
import ColorUtil, { EnumHexFormat } from "common/ColorUtil";
import ColorBox from "./ColorBox";

const rgba2sketch = (rgba: RgbaObject): RGBColor => {
  const { red, green, blue, alpha } = rgba;
  return { a: alpha, r: red, g: green, b: blue };
};
const sketch2rgba = (sketch: RGBColor): RgbaObject => {
  const { r, g, b, a } = sketch;
  return { alpha: a || 1, red: r, green: g, blue: b };
};

type TypeColorChangerProps = {
  defaultColor: string;
  onChange: (color: string) => void;
};
function ColorPicker(props: TypeColorChangerProps): JSX.Element {
  const [inputColor, setInputColor] = useState(props.defaultColor);
  const [rgbColor, setRgbColor] = useState<RgbaObject>(
    ColorUtil.createBlackRgba()
  );

  useEffect(() => {
    try {
      // TODO: 根据项目配置颜色格式转换
      setRgbColor(ColorUtil.compileArgbHex(props.defaultColor));
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    setInputColor(props.defaultColor);
  }, [props.defaultColor]);

  useEffect(() => {
    setRgbColor(ColorUtil.compileArgbHex(inputColor));
  }, [inputColor]);

  return (
    <StyleColorPicker>
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
            // presetColors={getLocalStorage.presetColors}
            color={rgba2sketch(rgbColor)}
            onChange={color => {
              console.log(sketch2rgba(color.rgb));
              const rgba = sketch2rgba(color.rgb);
              setRgbColor(rgba);
              setInputColor(ColorUtil.rgbaFormat(rgba, EnumHexFormat.ARGB));
            }}
          />
        }
      >
        <ColorBox color={inputColor} />
      </Tooltip>
      <Input
        value={inputColor}
        placeholder="输入颜色（格式: #ffffff）"
        className="color-input"
        onChange={e => {
          const c = e.target.value;
          if (!isHex(c)) return;
          setInputColor(c);
        }}
        onBlur={e => {
          const c = e.target.value;
          if (!isHex(c)) {
            message.warn(`${c} 不是正确的颜色格式`);
            setInputColor(props.defaultColor);
            return;
          }
          setInputColor(c);
        }}
      />
    </StyleColorPicker>
  );
}

const StyleColorPicker = styled.div`
  display: flex;
  align-items: center;
  position: inline-block;
  .color-input {
    width: 100px;
    height: 36px;
    margin: 0 10px;
    border-radius: 6px;
  }
`;

export default ColorPicker;
