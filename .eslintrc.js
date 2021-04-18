const isDev = process.env.REACT_APP_ENV !== "production";
const extensions = [
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".json",
  ".scss",
  ".less",
  ".md"
];

module.exports = {
  env: {
    browser: true,
    // es2021: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: [
    "import",
    "react",
    "react-hooks",
    "prettier",
    "@typescript-eslint",
    "css-modules",
    "markdown"
    // "jsx-a11y", // 无障碍
  ],
  extends: [
    "react-app",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:css-modules/recommended",
    "plugin:markdown/recommended",

    "plugin:import/typescript", //

    "plugin:@typescript-eslint/recommended",
    // 'plugin:@typescript-eslint/eslint-recommended',
    /**
     * 使得@typescript-eslint中的样式规范失效
     * 遵循prettier中的样式规范
     * "prettier/@typescript-eslint" has been merged into "prettier" in eslint-config-prettier 8.0.0.
     *  See: https://github.com/prettier/eslint-config-prettier/blob/main/CHANGELOG.md#version-800-2021-02-21
     */
    // "prettier/@typescript-eslint",
    /**
     * 使用prettier中的样式规范
     * 且如果使得ESLint会检测prettier的格式问题
     * 同样将格式问题以error的形式抛出
     */
    "plugin:prettier/recommended"
    /**
     * 无障碍
     * https://zh-hans.reactjs.org/docs/accessibility.html
     */
    // "plugin:jsx-a11y/recommended",
  ],
  settings: {
    "react": {
      pragma: "React",
      version: "detect"
    },
    // 'import/extensions': ['.js', '.ts'],
    "import/resolver": {
      node: {
        extensions
      },
      // eslint-import-resolver-alias
      alias: {
        $: "./src",
        extensions
      }
    }
  },
  rules: {
    "react/prop-types": "off", // React.FC 报错未知问题，暂时关闭
    "@typescript-eslint/no-unused-vars": isDev ? "warn" : "error", // 未使用的值作为警告
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn", // hooks 规则
    "prefer-template": "error", // 使用模板字符串
    "no-useless-concat": "error", // 进制没必要的字符串拼接
    "no-duplicate-imports": "warn", // 禁止重复导入
    // import 排序  https://github.com/benmosher/eslint-plugin-import/tree/v2.22.1
    "import/order": "warn",
    "import/newline-after-import": ["warn", { count: 1 }] // import 后空一行
  },
  overrides: [
    {
      // 2. Enable the Markdown processor for all .md files.
      files: ["**/*.md"],
      processor: "markdown/markdown"
    }
  ]
};
