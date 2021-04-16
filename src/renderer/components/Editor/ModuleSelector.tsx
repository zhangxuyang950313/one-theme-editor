import React, { useState } from "react";
import styled from "styled-components";

type TypeProps = {
  icons: string[];
  onSelected: (x: number) => void;
};
// 模块选择器
const ModuleSelector: React.FC<TypeProps> = props => {
  const { icons, onSelected } = props;
  const [selectedIndex, updateIndex] = useState(0);

  return (
    <StyleModuleSelector>
      {icons.map((item, key) => {
        return (
          <StyleIcon
            key={key}
            isActive={selectedIndex === key}
            onClick={() => {
              updateIndex(key);
              onSelected(key);
            }}
          >
            <img className="icon" alt="" src={item} />
          </StyleIcon>
        );
      })}
    </StyleModuleSelector>
  );
};

const StyleModuleSelector = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 100vh;
  overflow-y: auto;
  border-right: ${({ theme }) => theme["@border-color-base"]} 1px solid;
  padding: 80px 0;
`;
type TypeStyleIconProps = { isActive: boolean };
const StyleIcon = styled.div<TypeStyleIconProps>`
  cursor: pointer;
  width: ${({ isActive }) => (isActive ? "55px" : "45px")};
  opacity: ${({ isActive }) => (isActive ? 1 : 0.4)};
  margin: 20px auto;
  &:hover {
    width: 60px;
  }
  transition: 0.4s all ease;
  .icon {
    width: 100%;
  }
`;

export default ModuleSelector;
