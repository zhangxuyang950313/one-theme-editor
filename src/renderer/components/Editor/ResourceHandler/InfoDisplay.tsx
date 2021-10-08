import React from "react";
import styled from "styled-components";

const InfoDisplay: React.FC<{
  className?: string;
  title: string;
  description: string;
}> = props => {
  const { title, description, className } = props;

  return (
    <StyleInfoDisplay className={className}>
      <div className="title">{title}</div>
      <div className="description">{description}</div>
    </StyleInfoDisplay>
  );
};

const StyleInfoDisplay = styled.div`
  display: flex;
  flex-direction: column;
  /* max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */
  .title {
    font-size: ${({ theme }) => theme["@text-size-main"]};
    color: ${({ theme }) => theme["@text-color"]};
  }
  .description {
    /* user-select: text; */
    font-size: ${({ theme }) => theme["@text-size-secondary"]};
    color: ${({ theme }) => theme["@text-color-secondary"]};
  }
`;

export default InfoDisplay;
