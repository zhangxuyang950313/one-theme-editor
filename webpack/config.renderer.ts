import path from "path";
import WebpackBar from "webpackbar";
import webpack, { DefinePlugin, HotModuleReplacementPlugin } from "webpack";
import WebpackDevServer from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import PostcssPresetEnv from "postcss-preset-env";
import CopyWebpackPlugin from "copy-webpack-plugin";
import DotEnvPlugin from "dotenv-webpack";
import EslintPlugin from "eslint-webpack-plugin";
// import WorkboxPlugin from "workbox-webpack-plugin"; // 引入 PWA 插件
// import postCssPresetEnv from "postcss-preset-env";
// import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import {
  alias,
  rootDir,
  extensions,
  outputDir,
  eslintConfigFile,
  entryFile,
  WDS_SOCKET_HOST,
  WDS_SERVER_HOST,
  WDS_SOCKET_PORT,
  WDS_SERVER_PORT
} from "./constant";

const webpackDevClientEntry = require.resolve(
  "react-dev-utils/webpackHotDevClient"
);
const reactRefreshOverlayEntry = require.resolve(
  "react-dev-utils/refreshOverlayInterop"
);

const getCssLoaders = (options: { isDev: boolean; importLoaders: number }) => {
  return [
    options.isDev
      ? { loader: "style-loader" } // style-loader 实现了 HMR
      : MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        importLoaders: options.importLoaders,
        sourceMap: options.isDev
      }
    },
    { loader: "scoped-css-loader" },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          ident: "postcss",
          plugins: () => [PostcssPresetEnv()]
        }
      }
    }
  ].filter(Boolean);
};

const devServer: WebpackDevServer.Configuration = {
  host: WDS_SERVER_HOST,
  port: WDS_SERVER_PORT,
  sockHost: WDS_SOCKET_HOST,
  sockPort: WDS_SOCKET_PORT,
  contentBase: "./release.renderer",
  // By default files from `contentBase` will not trigger a page reload.
  watchContentBase: false,
  compress: true, // 是否启用 gzip 压缩
  open: false, // 打开默认浏览器
  hot: true, // 热更新
  transportMode: "ws",
  writeToDisk: true,
  stats: "errors-warnings",
  // clientLogLevel: "info",
  overlay: true,
  quiet: false
};

const config: webpack.ConfigurationFactory = (env, args) => {
  const isDev = args.mode !== "production";
  return {
    target: "electron-renderer",
    devtool: isDev ? "source-map" : false,
    watchOptions: {
      ignored: "**/node_modules"
    },
    ...(isDev ? { devServer } : {}),
    // profile: false, // 选项捕获编译时每个步骤的时间信息，并且将这些信息包含在输出中
    /**
     * 构建时控制台信息
     * https://www.webpackjs.com/configuration/stats/
     */
    stats: "errors-warnings",
    entry: entryFile.render,
    output: {
      // 输出目录
      path: outputDir.render,
      // publicPath: "http://localhost:30000/image?file=",
      filename: isDev ? "js/[name].js" : "js/[name].[contenthash:8].js",
      chunkFilename: isDev
        ? "js/[name].chunk.js"
        : "js/[name].[contenthash:8].chunk.js",
      hotUpdateChunkFilename: "hmr/[id].hot-update.js",
      hotUpdateMainFilename: "hmr/runtime.hot-update.json",
      /**
       * 模块中包含路径信息
       * https://www.webpackjs.com/configuration/output/#output-pathinfo
       */
      pathinfo: isDev,
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: "this"
    },
    externals: {
      fsevents: "fsevents"
    },
    optimization: {
      minimize: !isDev,
      runtimeChunk: "multiple",
      // runtimeChunk: {
      //   name: ({ name }) => `runtime-${name}`
      // }
      splitChunks: {
        /**
         * 表示哪些代码需要优化，有三个可选值：
         * initial(初始块)、async(按需加载块)、all(全部块)，默认为async
         * initial, all模式会将所有来自node_modules的模块分配到一个叫vendors的缓存组；
         * 所有重复引用至少两次的代码，会被分配到default的缓存组。
         *  */
        chunks: "async",
        // 表示在压缩前的最小模块大小，默认为30000
        minSize: 20000,
        // 提取出的新chunk在两次压缩之前要小于多少kb，默认为0，即不做限制
        maxSize: 0,
        // 表示被引用次数，默认为1
        minChunks: 1,
        // 按需加载时候最大的并行请求数，默认为5
        maxAsyncRequests: 30,
        // 一个入口最大的并行请求数，默认为3
        maxInitialRequests: 30,
        // enforceSizeThreshold: 50000,
        // 命名连接符
        automaticNameDelimiter: "-",
        // 拆分出来块的名字，默认由块名和hash值自动生成
        name: false,
        // 缓存组。缓存组的属性除上面所有属性外，还有test, priority
        cacheGroups: {
          defaultVendors: {
            // 用于控制哪些模块被这个缓存组匹配到
            test: /[\\/]node_modules[\\/]/,
            // 缓存组打包的先后优先级
            priority: -10,
            // 如果当前代码块包含的模块已经有了，就不在产生一个新的代码块
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    resolve: {
      alias: {
        ...alias,
        "@": path.resolve(rootDir, "src/renderer")
      },
      extensions
    },
    module: {
      rules: [
        {
          test: /\.node$/,
          use: "node-loader"
        },
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
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript"
              ],
              plugins: [
                "transform-class-properties",
                "@babel/plugin-transform-runtime",
                "babel-plugin-styled-components",
                "babel-plugin-react-scoped-css",
                isDev && "react-refresh/babel"
              ].filter(Boolean)
            }
          }
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          use: {
            loader: "url-loader",
            options: {
              limit: 10 * 1024,
              name: "[name].[contenthash:8].[ext]",
              outputPath: "assets/images"
            }
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: {
            loader: "file-loader",
            options: {
              limit: 10 * 1024,
              name: "[name].[contenthash:8].[ext]",
              outputPath: "assets/fonts"
            }
          }
        },
        {
          test: /\.css$/,
          /**
           * importLoaders
           * 启用/禁用或设置在CSS加载程序之前应用的加载程序的数量。
           * importLoaders 选项允许你配置在 css-loader 之前有多少 loader 应用于@imported 资源。
           */
          use: getCssLoaders({ importLoaders: 1, isDev })
        },
        {
          test: /\.(sc|sa)ss$/,
          use: [
            ...getCssLoaders({ importLoaders: 3, isDev }),
            { loader: "sass-loader" }
          ]
        },
        {
          test: /\.less$/,
          use: [
            ...getCssLoaders({ importLoaders: 3, isDev }),
            { loader: "less-loader" }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(rootDir, "public"),
            to: outputDir.render,
            toType: "dir"
            // filter: file => path.basename(file) !== "index.html"
          }
          // // 将 static 移动至 app 以加密 app.asar
          // {
          //   from: path.resolve(rootDir, "static"),
          //   to: path.resolve(reactOutputDir, "static"),
          //   force: true
          // }
        ]
      }),
      new EslintPlugin({
        overrideConfigFile: eslintConfigFile
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(rootDir, "public/index.html"), // 指定模板路径
        filename: "index.html", // 最终创建的文件名
        cache: false,
        ...(isDev && {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
          }
        })
      }),
      new MiniCssExtractPlugin({
        filename: isDev ? "css/[name].css" : "css/[name].[contenthash:8].css",
        chunkFilename: isDev
          ? "css/[name].chunk.css"
          : "css/[name].[contenthash:8].chunk.css"
      }),
      new WebpackBar({
        name: `渲染进程编译中...(${args.mode})`,
        color: "green",
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
      }),
      // 环境区分
      ...(isDev
        ? [
            new HotModuleReplacementPlugin(),
            new ReactRefreshPlugin({
              overlay: {
                entry: webpackDevClientEntry,
                // The expected exports are slightly different from what the overlay exports,
                // so an interop is included here to enable feedback on module-level errors.
                module: reactRefreshOverlayEntry,
                // Since we ship a custom dev client and overlay integration,
                // the bundled socket handling logic can be eliminated.
                sockIntegration: false
              }
            })
            // new FriendlyErrorsWebpackPlugin({
            //   compilationSuccessInfo: {
            //     messages: [
            //       `Your app run at http://${devServer.host}:${devServer.port}`
            //     ],
            //     notes: []
            //   },
            //   clearConsole: true
            // })
          ]
        : [
            // PWA配置，生产环境才需要
            // new WorkboxPlugin.GenerateSW({
            //   clientsClaim: true,
            //   skipWaiting: true
            // })
          ])
    ]
  };
};

export default config;
