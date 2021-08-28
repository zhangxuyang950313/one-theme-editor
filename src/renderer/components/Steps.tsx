import React from "react";
import styled from "styled-components";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

type TypeProps = {
  current: number;
  steps: string[];
  className?: string;
};
const Steps: React.FC<TypeProps> = props => {
  return (
    <StyleSteps className={props.className}>
      {props.steps.map((step, key) => {
        const isStep = props.current >= key;
        const isStepped = props.current > key;
        return (
          <StyleStep isStep={isStep} isStepped={isStepped} key={key}>
            {isStepped ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            <span className="step-item-title">{step}</span>
            <span className="step-item-divider"></span>
          </StyleStep>
        );
      })}
    </StyleSteps>
  );
};

const StyleSteps = styled.div`
  display: flex;
  align-items: center;
`;

type StyleStepProps = {
  isStep: boolean;
  isStepped: boolean;
};
const StyleStep = styled.div<StyleStepProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ isStep }) => (isStep ? 1 : 0.5)};
  color: ${({ theme, isStepped }) =>
    isStepped ? theme["@primary-color"] : theme["@text-color"]};
  transition: all 0.5s ease;
  .step-item-title {
    white-space: nowrap;
    margin: 10px;
  }
  &:not(:last-child) {
    width: 100%;
    margin-right: 10px;
    .step-item-divider {
      width: 100%;
      height: 1px;
      opacity: ${({ isStepped }) => (isStepped ? 1 : 0.5)};
      background-color: ${({ theme, isStepped }) =>
        isStepped ? theme["@primary-color"] : theme["@text-color"]};
    }
  }
`;
export default Steps;
