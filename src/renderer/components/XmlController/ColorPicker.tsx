import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { RgbaObject } from "hex-rgb";

import { Input, message, Tooltip } from "antd";
import { RGBColor, SketchPicker } from "react-color";
import ColorUtil, { HEX_TYPES } from "src/core/ColorUtil";
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
  placeholder: string;
  onChange: (color: string) => void;
};
function ColorPicker(props: TypeColorChangerProps): JSX.Element {
  const { defaultColor, placeholder, onChange } = props;
  const [inputColor, setInputColor] = useState(defaultColor);
  const [cssColor, setCssColor] = useState("");
  const [rgbColor, setRgbColor] = useState<RgbaObject>();
  const RefInputPrev = useRef(inputColor);

  useEffect(() => {
    try {
      // TODO: 根据项目配置颜色格式转换
      if (!defaultColor) return;
      const colorUtil = new ColorUtil(defaultColor, HEX_TYPES.ARGB);
      setRgbColor(colorUtil.getRgbaData());
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    RefInputPrev.current = defaultColor;
    setInputColor(defaultColor);
  }, [defaultColor]);

  useEffect(() => {
    if (!ColorUtil.isUnit8Hex(inputColor)) return;
    const colorUtil = new ColorUtil(inputColor, HEX_TYPES.ARGB);
    setRgbColor(colorUtil.getRgbaData());
    setCssColor(colorUtil.format(HEX_TYPES.RGBA));
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
            color={rgbColor ? rgba2sketch(rgbColor) : ""}
            onChange={color => {
              const rgba = sketch2rgba(color.rgb);
              setInputColor(ColorUtil.rgbaFormat(rgba, HEX_TYPES.ARGB));
            }}
            onChangeComplete={color => {
              const rgba = sketch2rgba(color.rgb);
              onChange(ColorUtil.rgbaFormat(rgba, HEX_TYPES.ARGB));
            }}
          />
        }
      >
        <ColorBox color={cssColor} />
      </Tooltip>
      <Input
        value={inputColor}
        defaultValue={inputColor}
        placeholder={placeholder}
        className="color-input"
        onChange={e => {
          const color = e.target.value;
          if (color.length > 9) {
            message.warn(`${color} 不是正确的颜色格式`);
            return;
          }
          setInputColor(color);
        }}
        onBlur={e => {
          const color = e.target.value;
          if (ColorUtil.isUnit8Hex(color)) {
            RefInputPrev.current = color;
            return;
          }
          message.warn(`${color} 不是正确的颜色格式`);
          setInputColor(RefInputPrev.current);
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
    width: 120px;
    height: 36px;
    margin: 0 10px;
    border-radius: 6px;
  }
`;

export default ColorPicker;
