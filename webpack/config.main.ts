import path from "path";
import webpack, { DefinePlugin } from "webpack";
import WebpackBar from "webpackbar";
import DotEnvPlugin from "dotenv-webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { extensions, entryFile, outputDir, alias, rootDir } from "./constant";

const config: webpack.ConfigurationFactory = (env, args) => {
  const isDev = args.mode !== "production";
  return {
    target: "electron-main",
    devtool: false,
    watchOptions: {
      ignored: "**/node_modules"
    },
    profile: false, // 选项捕获编译时每个步骤的时间信息，并且将这些信息包含在输出中
    stats: "errors-warnings", // 构建时控制台信息
    entry: { index: entryFile.main[isDev ? "dev" : "pro"] },
    output: {
      // 输出目录: release.main
      path: outputDir.main,
      filename: "[name].js"
    },
    optimization: {
      minimize: !isDev
    },
    resolve: {
      extensions,
      alias: {
        ...alias,
        "@": path.resolve(rootDir, "src/server")
      }
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
        name: `主进程编译中...(${args.mode})`,
        color: "yellow",
        profile: true,
        fancy: true
      }),
      new DotEnvPlugin({
        path: path.resolve(__dirname, "../.env"),
        safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
        allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
        systemvars: true, // load all the predefinition 'process.env' variables which will trump anything local per dotenv specs.
        silent: true, // hide any errors
        defaults: false // load '.env.defaults' as the default values if empty.
      }),
      new DefinePlugin({
        "process.env.NODE_ENV": `'${args.mode}'`
      })
    ]
  };
};

export default config;
