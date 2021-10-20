import styled from "styled-components";

export const StyleBorderLeft = styled.div`
  border-left: 1px solid;
  border-left-color: ${({ theme }) => theme["@border-color-base"]};
`;

export const StyleBorderRight = styled.div`
  border-right: 1px solid;
  border-right-color: ${({ theme }) => theme["@border-color-base"]};
`;

export const StyleGirdBackground = styled.span<{ girdSize?: number }>`
  /* background-color: #c2c2c2; */
  background-color: ${({ theme }) => theme["@gird-background-color"]};
  background-image: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.25) 25%,
      transparent 0,
      transparent 75%,
      rgba(0, 0, 0, 0.25) 0
    ),
    linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.25) 25%,
      transparent 0,
      transparent 75%,
      rgba(0, 0, 0, 0.25) 0
    );
  /* background-color: #eee; */
  background-color: ${({ theme }) => theme["@gird-background-color"]};
  background-size: ${({ girdSize }) =>
    `${girdSize || 16}px ${girdSize || 16}px`};
  background-position: ${({ girdSize }) => {
    const s = (girdSize || 16) / 2;
    return ` 0 0, ${s}px ${s}px`;
  }};
`;

// 顶部 drag 组件
export const StyleTopDrag = styled.div<{ height: string }>`
  z-index: 9999;
  position: absolute;
  top: 0;
  width: 100%;
  height: ${({ height }) => height || "30px"};
  -webkit-app-region: drag;
`;
