// webpack_dll.config.js
import path from "path";

import { DllPlugin } from "webpack";

module.exports = {
  entry: {
    canvas: ["canvas"],
    react: ["react", "react-dom"],
    styled: ["styled-components"],
    arco: ["@arco-design/web-react/icon", "@arco-design/web-react"],
    antd: ["antd"]
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
};
