import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Input, message, Tooltip } from "antd";
import { RGBColor, SketchPicker } from "react-color";
import { StyleGirdBackground } from "@/style";
import { RgbaObject } from "hex-rgb";
import ColorUtil, { HEX_FORMAT } from "src/common/utils/ColorUtil";

// 颜色小方块
const ColorBox: React.FC<{ color: string; onClick?: () => void }> = props => {
  const { color, onClick } = props;
  return (
    <Tooltip title={color}>
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

// rgba 和 react-color-picker 数据互转
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
  onChange?: (color: string) => void;
  onDisabled?: (color: string) => void;
};

// 颜色选择器
function ColorPick(props: TypeColorChangerProps): JSX.Element {
  const { defaultColor, placeholder, onChange, onDisabled } = props;
  const [inputColor, setInputColor] = useState(defaultColor);
  const [cssColor, setCssColor] = useState("");
  const [rgbColor, setRgbColor] = useState<RgbaObject>();
  const RefInputPrev = useRef(inputColor);

  useEffect(() => {
    try {
      // TODO: 根据项目配置颜色格式转换
      if (!defaultColor) return;
      const colorUtil = new ColorUtil(defaultColor, HEX_FORMAT.ARGB);
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
    try {
      if (!ColorUtil.isUnit8Hex(inputColor)) return;
      const colorUtil = new ColorUtil(inputColor, HEX_FORMAT.ARGB);
      setRgbColor(colorUtil.getRgbaData());
      setCssColor(colorUtil.format(HEX_FORMAT.RGBA));
    } catch (err) {
      console.log(err);
    }
  }, [inputColor]);

  return (
    <StyleColorPick>
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
              const rgbaData = sketch2rgba(color.rgb);
              const argbStr = ColorUtil.rgbaFormat(rgbaData, HEX_FORMAT.ARGB);
              setInputColor(argbStr);
              onChange && onChange(argbStr);
            }}
          />
        }
        onVisibleChange={visible => {
          !visible && onDisabled && onDisabled(inputColor);
        }}
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
    </StyleColorPick>
  );
}

const StyleColorPick = styled.div`
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

// 颜色值选择器
const ColorPicker: React.FC<{
  value: string;
  onChange: (x: string) => void;
}> = props => {
  const { value, onChange } = props;
  const defaultColor = new ColorUtil(value, HEX_FORMAT.ARGB).format(
    HEX_FORMAT.RGBA
  );

  return (
    <StyleColorPicker>
      {/* <ColorBox color={defaultColor} /> */}
      {/* <RightCircleOutlined
          className="middle-button"
          onClick={() => onChange(defaultValue)}
        /> */}
      <ColorPick
        defaultColor={value}
        placeholder={defaultColor}
        onDisabled={onChange}
      />
      {!ColorUtil.isHex(value) && (
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
  .error {
    color: ${({ theme }) => theme["@error-color"]};
    font-size: ${({ theme }) => theme["@text-size-thirdly"]};
  }
  /* .middle-button {
    cursor: pointer;
    color: ${({ theme }) => theme["@text-color-secondary"]};
    font-size: 22px;
    margin: 10px;
    transition: all 0.3s;
    &:hover {
      opacity: 0.5;
    }
  } */
`;

export default ColorPicker;
