import { ALIGN_VALUE, ALIGN_V_VALUE } from "src/common/enums";

import type { TypeLayoutData } from "src/types/config.page";

type LayoutStyleComputed = {
  display: "inline";
  position: "absolute";
  left: `${string}px`;
  top: `${string}px`;
  width: `${string}px` | "none";
  height: `${string}px` | "none";
  lineHeight: `${string}px` | "none";
  transform: `translate(${string}, ${string})`;
  boxSizing: "border-box";
};

export function computeLayoutStyle(
  layout: TypeLayoutData,
  scale: number
): LayoutStyleComputed {
  const numX = Number(layout.x);
  const numY = Number(layout.y);
  const numW = Number(layout.w);
  const numH = Number(layout.h);
  // switch (layout.align) {
  //   case ALIGN_VALUE.CENTER: {
  //     numX = numX - numW / 2;
  //     break;
  //   }
  //   case ALIGN_VALUE.RIGHT: {
  //     numX = numX - numW;
  //     break;
  //   }
  // }
  // switch (layout.alignV) {
  //   case ALIGN_V_VALUE.CENTER: {
  //     numY = numY - numH / 2;
  //     break;
  //   }
  //   case ALIGN_V_VALUE.BOTTOM: {
  //     numY = numY - numH;
  //     break;
  //   }
  // }
  const style: LayoutStyleComputed = {
    display: "inline",
    position: "absolute",
    boxSizing: "border-box",
    left: `${(numX * scale).toFixed(0)}px`,
    top: `${(numY * scale).toFixed(0)}px`,
    width: numW ? `${(numW * scale).toFixed(0)}px` : "none",
    height: numH ? `${(numH * scale).toFixed(0)}px` : "none",
    lineHeight: numH ? `${(numH * scale).toFixed(0)}px` : "none",
    get transform(): LayoutStyleComputed["transform"] {
      let transformX = "0";
      let transformY = "0";
      switch (layout.align) {
        case ALIGN_VALUE.CENTER: {
          transformX = "-50%";
          break;
        }
        case ALIGN_VALUE.RIGHT: {
          transformX = "-100%";
          break;
        }
      }
      switch (layout.alignV) {
        case ALIGN_V_VALUE.CENTER: {
          transformY = "-50%";
          break;
        }
        case ALIGN_V_VALUE.BOTTOM: {
          transformY = "-100%";
          break;
        }
      }
      return `translate(${transformX}, ${transformY})`;
    }
  };
  return style;
}
