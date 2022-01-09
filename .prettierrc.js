// https://prettier.io/docs/en/options.html
module.exports = {
  "overrides": [
    {
      "files": [".eslintrc.js", ".prettierrc.js", ".stylelintrc.js", ".huskyrc.js"]
    },
    {
      "files": [
        "*.ts", 
        "*.tsx", 
        "*.js", 
        "*.jsx", 
        "*.vue", 
        "*.css", 
        "*.less", 
        "*.scss", 
        "*.html", 
        "*.yml", 
        "*.md", 
        "*.json", 
        "*.jsonc"],
      "options": {
        // "parser": "react",
        "printWidth": 120, // 将确保你的单行代码不会超过 n 个字符。
        "singleQuote": false, // 会将所有双引号转换为单引号
        /**
         * "as-needed" - Only add quotes around object properties where required.
         * "consistent" - If at least one property in an object requires quotes, quote all properties.
         * "preserve" - Respect the input use of quotes in object properties.
         */
        "quoteProps": "consistent",
        /**
         * "always" - Always include parens. Example: (x) => x
         * "avoid" - Omit parens when possible. Example: x => x
         */
        "arrowParens": "avoid",
        "trailingComma": "none", // 将确保在最后一个对象属性的末尾会有一个逗号
        "bracketSpacing": true, // 在对象字面量之间打印空格
        "jsxBracketSameLine": false, // 将在多行 JSX 元素的最后一行放置 >，否则另起一行
        "tabWidth": 2, // 指定单个缩进的空格数
        "semi": true, // 将在语句末尾加上;
        "useTabs": false, // 使用tab
        "jsxSingleQuote": false, // JSX 中使用双引号
        /**
         * "lf" – Line Feed only (\n), common on Linux and macOS as well as inside git repos
         * "crlf" - Carriage Return + Line Feed characters (\r\n), common on Windows
         * "cr" - Carriage Return character only (\r), used very rarely
         * "auto" - Maintain existing line endings (mixed values within one file are normalised by looking at what’s used after the first line)
         */
        "endOfLine": "auto"
      }
    }
  ]
}
