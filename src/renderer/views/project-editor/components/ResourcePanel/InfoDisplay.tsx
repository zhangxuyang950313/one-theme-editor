import React from "react";
import styled from "styled-components";

const InfoDisplay: React.FC<{
  className?: string;
  main?: string;
  secondary?: string;
}> = props => {
  const { main, secondary, className } = props;

  return (
    <StyleInfoDisplay className={className}>
      {main && <div className="main">{main}</div>}
      {secondary && <div className="secondary">{secondary}</div>}
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
  .main {
    font-size: ${({ theme }) => theme["@text-size-main"]};
    color: ${({ theme }) => theme["@text-color"]};
  }
  .secondary {
    /* user-select: text; */
    font-size: ${({ theme }) => theme["@text-size-secondary"]};
    color: ${({ theme }) => theme["@text-color-secondary"]};
  }
`;

export default InfoDisplay;
