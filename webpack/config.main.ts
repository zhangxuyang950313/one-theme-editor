import path from "path";
import webpack from "webpack";
import WebpackBar from "webpackbar";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { rootDir, electronOutputDir, extensions } from "./constant";

const isDev = process.env.NODE_ENV;

const config: webpack.Configuration = {
  target: "electron-main",
  devtool: false,
  watchOptions: {
    ignored: "**/node_modules"
  },
  profile: false, // 选项捕获编译时每个步骤的时间信息，并且将这些信息包含在输出中
  stats: "errors-warnings", // 构建时控制台信息
  entry: {
    index: path.resolve(
      rootDir,
      "src/main",
      isDev ? "index.dev.ts" : "index.ts"
    )
  },
  output: {
    // 输出目录: release.main
    path: electronOutputDir,
    filename: "[name].js"
  },
  optimization: {
    minimize: !isDev
  },
  resolve: {
    extensions
  },
  module: {
    rules: [
      {
        // npm i babel-loader @babel/core @babel/preset-env -D
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          // https://webpack.docschina.org/loaders/babel-loader/
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            cacheCompression: true,
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackBar({
      name: `主进程编译中...(${process.env.NODE_ENV})`,
      color: "yellow",
      profile: true,
      fancy: true
    })
  ]
};

export default config;
