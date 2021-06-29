import styled from "styled-components";

export const StyleBorderLeft = styled.div`
  border-left: 1px solid;
  border-left-color: ${({ theme }) => theme["@border-color-base"]};
`;

export const StyleBorderRight = styled.div`
  border-right: 1px solid;
  border-right-color: ${({ theme }) => theme["@border-color-base"]};
`;
