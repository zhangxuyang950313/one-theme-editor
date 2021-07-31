import React from "react";
import styled from "styled-components";

const Wrapper: React.FC<{
  name: string;
  description: string;
}> = props => {
  const { name, description } = props;

  return (
    <StyleWrapper>
      <div className="text-wrapper">
        <span className="description">{description}</span>
        <span className="value-name">{name}</span>
      </div>
      {props.children}
    </StyleWrapper>
  );
};

const StyleWrapper = styled.div`
  .text-wrapper {
    display: flex;
    flex-direction: column;
    .description {
      font-size: ${({ theme }) => theme["@text-size-main"]};
      color: ${({ theme }) => theme["@text-color"]};
    }
    .value-name {
      user-select: text;
      margin: 6px 0;
      font-size: ${({ theme }) => theme["@text-size-secondary"]};
      color: ${({ theme }) => theme["@text-color-secondary"]};
    }
  }
`;

export default Wrapper;
