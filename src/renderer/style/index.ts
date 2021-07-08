import styled from "styled-components";

export const StyleBorderLeft = styled.div`
  border-left: 1px solid;
  border-left-color: ${({ theme }) => theme["@border-color-base"]};
`;

export const StyleBorderRight = styled.div`
  border-right: 1px solid;
  border-right-color: ${({ theme }) => theme["@border-color-base"]};
`;

export const StyleGirdBackground = styled.span`
  background-color: #c2c2c2;
  background-image: linear-gradient(45deg, #6d6d6d 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #6d6d6d 0),
    linear-gradient(45deg, #6d6d6d 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #6d6d6d 0);
  background-size: 14px 14px;
  background-position: 0 0, 7px 7px, 7px 7px, 0 0;
`;
