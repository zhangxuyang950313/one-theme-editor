import "styled-components";
import defaultTheme from "@/style/theme";

declare module "styled-components" {
  type CustomTheme = typeof defaultTheme;
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends CustomTheme {
    // 'app-bg': string; // 应用背景底色
    // 'main': string; // 主要颜色
    // 'secondary': string; // 次要颜色
    // 'title': string; // 主要文字颜色
    // 'subtitle': string; // 次要文字颜色
    // 'description': string; // 不可按、描述文字
    // 'header-bg': string; // 标题栏背景
    // 'template-selector-bg': string; // 模板选择面板背景
    // 'template-item-bg': string; // 单个模板背景
    // 'tools-bar-bg': string; // 工具栏背景
    // 'product-manager-bg': string; // 产品管理背景
    // 'add-production-button-bg': string; // 添加产品按钮背景
    // 'page-selector-bg': string; // 页面选择列表背景
    // 'module-selector-bg': string; // 模块选择面板背景
    // 'page-preview-bg': string; // 预览面板背景
    // 'image-editor-panel-bg': string; // 图片编辑面板背景
    // 'icon-button-bg-normal': string; // 图标按钮常态背景色
    // 'icon-button-bg-hover': string; // 图标按钮按下背景色
    // 'scrollbar-thumb': string; // 滚动条颜色
    // 'scrollbar-track': string; // 滚动条背景颜色
    // 'danger': string; // 危险警告色
    // 'warn': string; // 提醒色
    // 'divider': string; // 分割线
  }
}
