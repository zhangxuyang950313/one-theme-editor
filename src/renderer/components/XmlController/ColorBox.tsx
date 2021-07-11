import React from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import { StyleGirdBackground } from "@/style";

const ColorBox: React.FC<{ color: string; onClick?: () => void }> = props => {
  const { color, onClick } = props;
  return (
    <Tooltip title={color}>
      <StyleColorBox
        girdSize={6}
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
export default ColorBox;
