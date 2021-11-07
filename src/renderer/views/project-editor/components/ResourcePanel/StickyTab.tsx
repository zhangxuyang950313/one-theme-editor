import React from "react";
import styled from "styled-components";

const StickyTab: React.FC<{ content: string }> = props => {
  return (
    <StyleStickyTabStyle>
      <span className="title">{props.content}</span>
    </StyleStickyTabStyle>
  );
};

const StyleStickyTabStyle = styled.div`
  z-index: 2;
  position: sticky;
  top: 0px;
  padding: 6px 20px;
  background-color: var(--color-bg-5);
  margin-bottom: 20px;
  border-bottom: 1px solid;
  border-bottom-color: var(--color-secondary);
  .title {
    color: var(--color-text-1);
    font-size: 22px;
  }
`;

export default StickyTab;
