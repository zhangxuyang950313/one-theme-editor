// webpack_dll.config.js
import path from "path";

import webpack, { DllPlugin } from "webpack";

const config: webpack.ConfigurationFactory = () => ({
  target: "electron-renderer",
  entry: {
    renderer: [
      "react",
      "react-dom",
      "react-color",
      "react-redux",
      "react-router-dom",
      "redux",
      "redux-devtools-extension",
      "styled-components",
      "@arco-design/web-react/icon",
      "@arco-design/web-react",
      "antd",
      "@ant-design/icons",
      "lodash",
      "xml-js"
    ]
  },
  output: {
    filename: "[name].dll.js",
    path: path.resolve(__dirname, "../release.dll"),
    library: "[name]" //dll的全局变量名
  },
  plugins: [
    new DllPlugin({
      context: path.dirname(process.cwd()),
      name: "[name]", //dll的全局变量名
      path: path.join(__dirname, "../release.dll", "[name].manifest.json") //描述生成的manifest文件
    })
  ]
});

export default config;
