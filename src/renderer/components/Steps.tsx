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
  /* opacity: ${({ isStep }) => (isStep ? 1 : 0.8)}; */
  color: ${({ isStepped }) =>
    isStepped ? "var(--color-primary-light-4)" : "var(--color-text-1)"};
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
      /* opacity: ${({ isStepped }) => (isStepped ? 1 : 0.8)}; */
      background-color: ${({ isStepped }) =>
        isStepped ? "var(--color-primary-light-4)" : "var(--color-text-1)"};
    }
  }
`;
export default Steps;
