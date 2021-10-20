import normal from "./normal";
import TypeTheme from "./light";

const darkColors: typeof TypeTheme = {
  ...normal,
  "@scrollbar-thumb": "grey",
  "@scrollbar-track": "#00000000",
  "@background-color": "#121212", // 背景色
  "@background-color-secondary": "#1b1b1c",
  "@background-color-thirdly": "#29292d",
  "@sidebar-color": "#1b1b1c",
  "@primary-color": "#ffc631", // 主色
  "@link-color": "#ffc631", // 链接色
  "@success-color": "#52c41a", // 成功色
  "@warning-color": "#faad14", // 警告色
  "@error-color": "#f5222d", // 错误色
  "@heading-color": "rgba(255, 255, 255, 0.85)", // 标题色
  "@text-color": "rgba(255,2550, 255, 0.65)", // 主文本色
  "@text-color-secondary": "rgba(255, 255, 255, 0.45)", // 次文本色
  "@disabled-color": "rgba(255, 255, 255, 0.25)", // 失效色
  "@border-color-base": "rgba(255, 255, 255, 0.2)", // 边框色
  "@border-color-secondary": "rgba(255, 255, 255, 0.1)",
  "@border-color-thirdly": "rgba(255, 255, 255, 0.05)",
  "@gird-background-color": "#929292",
  "@box-shadow-base": `
    0 3px 6px -4px rgba(255, 255, 255, 0.12),
    0 6px 16px 0 rgba(255, 255, 255, 0.08),
    0 9px 28px 8px rgba(255, 255, 255, 0.05)` // 浮层阴影
};
export default darkColors;
