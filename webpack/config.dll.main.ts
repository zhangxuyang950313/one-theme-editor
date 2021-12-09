// webpack_dll.config.js
import path from "path";

import webpack, { DllPlugin } from "webpack";

const config: webpack.ConfigurationFactory = () => ({
  target: "electron-main",
  entry: {
    main: [
      "electron",
      "electron-debug",
      "electron-devtools-installer",
      "archiver",
      "chokidar",
      "fs-extra",
      "nedb-promises"
    ]
  },
  output: {
    filename: "[name].dll.js",
    path: path.resolve(__dirname, "../release.dll"),
    library: "[name]" //dll的全局变量名
  },
  externals: {
    fsevents: "fsevents"
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
