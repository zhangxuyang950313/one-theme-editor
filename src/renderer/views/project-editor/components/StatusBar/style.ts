import styled from "styled-components";

export const StyleIconItemArea = styled.div`
  cursor: pointer;
  height: 80%;
  padding: 0 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  .icon {
    font-size: 14px;
  }
  .content {
    font-size: 12px;
    margin: 0 2px;
    display: flex;
    align-items: center;
  }
  &:hover {
    background-color: var(--color-secondary-active);
  }
`;
