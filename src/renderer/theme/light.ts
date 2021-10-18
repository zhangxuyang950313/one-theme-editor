import normal from "./normal";

const lightColors = {
  ...normal,
  "@scrollbar-thumb": "grey",
  "@scrollbar-track": "grey",
  "@background-color": "white", // 背景色
  "@sidebar-color": "white",
  "@primary-color": "#1890ff", // 主色
  "@link-color": "#1890ff", // 链接色
  "@success-color": "#52c41a", // 成功色
  "@warning-color": "#faad14", // 警告色
  "@error-color": "#f5222d", // 错误色
  "@heading-color": "rgba(0, 0, 0, 0.95)", // 标题色
  "@text-color": "rgba(0, 0, 0, 0.85)", // 主文本色
  "@text-color-secondary": "rgba(0, 0, 0, 0.45)", // 次文本色
  "@disabled-color": "rgba(0, 0, 0, 0.25)", // 失效色
  "@border-color-base": "rgba(0, 0, 0, 0.2)", // 边框色
  "@border-color-secondary": "rgba(0, 0, 0, 0.1)",
  "@border-color-thirdly": "rgba(0, 0, 0, 0.05)",
  "@box-shadow-base": `
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  ` // 浮层阴影
};
export default lightColors;
