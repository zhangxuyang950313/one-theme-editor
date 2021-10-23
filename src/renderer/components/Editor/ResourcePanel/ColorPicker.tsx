import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RgbaObject } from "hex-rgb";
import { Input, message, Tooltip } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { RGBColor, SketchPicker } from "react-color";
import ColorUtil, { HEX_FORMAT } from "src/common/utils/ColorUtil";
import { StyleGirdBackground } from "@/style";
import electronStore from "src/common/electronStore";
import { usePageConfig } from "@/hooks/resource";

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
  onChange?: (color: string) => void;
  onDisabled?: (color: string) => void;
}): JSX.Element {
  const { color, tipColor, onChange, onDisabled } = props;
  const [colorRGBAHex, setColorRGBAHex] = useState(color);
  const [colorRecently, setColorRecently] = useState<string[]>([]);
  const pageConfig = usePageConfig();

  useEffect(() => {
    setColorRGBAHex(color);
  }, [color]);

  const appendColorRecently = () => {
    const colorRecently = electronStore.get("colorRecently");
    if (!Array.isArray(colorRecently)) {
      electronStore.set("colorRecently", []);
      return;
    }
    const arr = Array.from(new Set([colorRGBAHex, ...colorRecently])).filter(
      item => {
        try {
          ColorUtil.create(item, pageConfig?.colorFormat || HEX_FORMAT.RGBA);
          return true;
        } catch (err) {
          return false;
        }
      }
    );
    if (arr.length > 55) {
      arr.length = 55;
    }
    electronStore.set("colorRecently", arr);
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
  format: HEX_FORMAT;
  onChange: (x: string) => void;
}> = props => {
  const { value, defaultValue, format, onChange } = props;
  const [defaultColor, setDefaultColor] = useState("");
  const [colorRGBAHex, setColorRGBAHex] = useState("");
  const [inputColor, setInputColor] = useState("");

  const resetColor = () => {
    if (inputColor !== "") setInputColor("");
    if (colorRGBAHex !== "") setColorRGBAHex("");
  };

  // 生成默认 formatter 规定的颜色
  useEffect(() => {
    try {
      setDefaultColor(ColorUtil.create(defaultValue, format).toRGBAHex());
    } catch (err: any) {
      console.log(err);
      message.warn(`默认颜色格式错误"${defaultValue}"`);
    }
  }, [defaultValue]);

  // 生成 formatter 规定的颜色
  useEffect(() => {
    try {
      setColorRGBAHex(ColorUtil.create(value, format).toRGBAHex());
      setInputColor(value);
    } catch (err: any) {
      // console.log("value", err);
      resetColor();
    }
  }, [value]);

  // 选色器和输入框联动
  useEffect(() => {
    try {
      setInputColor(
        ColorUtil.create(colorRGBAHex, HEX_FORMAT.RGBA).format(format)
      );
    } catch (err: any) {
      // console.log("colorRGBAHex", err);
      // message.warn(err.message);
    }
  }, [colorRGBAHex]);

  // 输入框与选色器联动
  useEffect(() => {
    try {
      setColorRGBAHex(ColorUtil.create(inputColor, format).toRGBAHex());
    } catch (err: any) {
      setColorRGBAHex("");
      // console.log("inputColor", err);
    }
  }, [inputColor]);

  // 在输入框失焦触发变更
  const onInputBlur = (val: string) => {
    try {
      if (inputColor !== "") {
        setColorRGBAHex(ColorUtil.create(val, format).toRGBAHex());
      }
      onChange(inputColor);
    } catch (err: any) {
      setInputColor(value);
      message.warn(err.message);
    }
  };

  return (
    <StyleColorPicker>
      <div className="content-wrapper">
        <ColorBox color={defaultColor} tipColor={defaultValue} />
        <RightCircleOutlined
          className="middle-button"
          onClick={() => onChange(defaultValue)}
        />
        <ColorPickerBox
          color={colorRGBAHex}
          tipColor={inputColor}
          onDisabled={() => onChange(inputColor)}
          onChange={setColorRGBAHex}
        />
        <Input
          value={inputColor}
          className="color-input"
          defaultValue={inputColor}
          placeholder={defaultValue}
          onChange={e => setInputColor(e.target.value)}
          onBlur={e => onInputBlur(e.target.value)}
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
      color: ${({ theme }) => theme["@text-color-secondary"]};
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
    color: ${({ theme }) => theme["@error-color"]};
    font-size: ${({ theme }) => theme["@text-size-thirdly"]};
  }
`;

export default ColorPicker;
