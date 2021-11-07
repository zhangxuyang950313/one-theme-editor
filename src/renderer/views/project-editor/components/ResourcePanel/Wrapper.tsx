import React from "react";
import styled from "styled-components";

const Wrapper: React.FC<{
  name: string;
  description: string;
}> = props => {
  const { name, description } = props;

  return (
    <StyleWrapper>
      {props.children}
      <div className="text-wrapper">
        <span className="description">{description}</span>
        <span className="value-name">{name}</span>
      </div>
    </StyleWrapper>
  );
};

const StyleWrapper = styled.div`
  .text-wrapper {
    display: flex;
    flex-direction: column;
    .description {
      font-size: 14px;
      color: var(--color-text-1);
    }
    .value-name {
      user-select: text;
      margin: 6px 0;
      font-size: 12px;
      color: var(--color-text-3);
    }
  }
`;

export default Wrapper;
