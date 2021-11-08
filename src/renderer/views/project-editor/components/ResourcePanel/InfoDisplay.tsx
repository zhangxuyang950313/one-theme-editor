import React from "react";
import styled from "styled-components";

const InfoDisplay: React.FC<{
  main?: string;
  secondary?: string;
}> = props => {
  const { main, secondary } = props;

  return (
    <StyleInfoDisplay>
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
    font-size: 14px;
    color: var(--color-text-1);
  }
  .secondary {
    /* user-select: text; */
    font-size: 12px;
    color: var(--color-text-3);
  }
`;

export default InfoDisplay;
