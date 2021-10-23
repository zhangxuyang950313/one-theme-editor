import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Tabs: React.FC<
  Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
    defaultIndex: number;
    data: Array<{ index: number; label: string }>;
    onChange?: (index: number) => void;
  }
> = props => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(props.defaultIndex);
  }, [props.defaultIndex]);

  return (
    <StyleTab className={props.className}>
      <div className="tabs">
        {[...props.data].map((item, index) => {
          return (
            <div
              data-active={!!(key === index)}
              className="tab"
              key={item.index}
              onClick={() => {
                setKey(index);
                props.onChange && props.onChange(index);
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </StyleTab>
  );
};

const StyleTab = styled.div`
  overflow-x: auto;
  border-bottom: 1px solid ${({ theme }) => theme["@border-color-secondary"]};
  .tabs {
    display: flex;
    width: 100%;
  }
  .tab {
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    padding: 15px 20px;
    transition: 0.2s ease;
    color: ${({ theme }) => theme["@text-color"]};
    &::after {
      transition: 0.2s ease;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      content: "";
      width: 0;
      opacity: 0;
    }
    &[data-active="true"] {
      transition: 0.2s ease;
      color: ${({ theme }) => theme["@primary-color"]};
      position: relative;
      font-weight: 600;
      &::after {
        opacity: 1;
        transition: 0.2s ease;
        position: absolute;
        content: "";
        bottom: 0;
        left: 50%;
        width: 60%;
        height: 3px;
        background-color: ${({ theme }) => theme["@primary-color"]};
        border-radius: 3px;
        transform: translateX(-50%);
      }
    }
  }
`;

export default Tabs;