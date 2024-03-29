### 一个全平台主题编辑器

#### 介绍
技术栈：Electron React Reselect TypeScript Nedb Socket.io
样式使用 CSS in JS 方案： styled-component

#### 关于 Electron@8.5.5 版本
由于 React devtools 和 Redux devtools 在 Electron 8 以上版本不能使用，目前没有找到解决方法，直到 12 问题依旧，故 Electron 版本锁定 8 最后一个版本 8.5.5

#### 关于 Electron@latest 版本升级
Redux 插件不太好使，好在可以不用，Redux 换为 Recoil

#### 关于 webpack@4.x.x 版本
目前 webpack 5 还有不少坑，暂时锁定 webpack 4 版本使用
以下包（或类型）严格按照版本使用，因为其内部会指定 webpack ^5，会导致类型报错甚至无法运行
稳定后升 webpack5
- mini-css-extract-plugin        @1.4.0
- @types/mini-css-extract-plugin @1.4.0 
- postcss-loader                 @4.3.0
- node-loader                    @1.0.3
- html-webpack-plugin            @4.5.2
- 其他参照 package.json
- 特别注意的在这里补充，不要乱升
- 升的时候选择 fixable，然后删 node_modules 测试


#### node-canvas
参考 https://www.electronjs.org/zh/docs/latest/tutorial/using-native-node-modules
- 直接安装，但是 abi 和 electron abi 不同导致无法启动，暂时无解
  - npm install --save canvas --canvas_binary_host_mirror=https://npm.taobao.org/mirrors/node-canvas-prebuilt/
- 手动编译 (靠谱方案)
  - brew install pkg-config cairo pango libpng jpeg giflib librsvg
  - cd node_modules/canvas
  - HOME=~/.electron-gyp ../node-gyp/bin/node-gyp.js node-gyp rebuild --target=8.5.5 --arch=x64 --dist-url=https://electronjs.org/headers


#### 本地 node 版本 >=12.0.0
配合 electron node 版本，rebuild 原生 node 模块，或 build 的时候，以及 webpack 等本地环境要求。
但运行时是使用的 electron node 版本，所以进程中只要满足 electron node 版本即可
image-size        >=12
electron-builder  >=14
log-symbols       >=14


#### 安装

```bash
npm install
npm run webpack:dll
```

#### 启动

```bash
# 启动主程序
npm start 
# 启动服务
npm run start:server
```

#### 构建

```bash
  
npm run start

npm run build:mac

npm run build:win32

npm run build:win64

npm run build:linux

```

#### electron 下载过慢

1. 尝试使用淘宝源或其他

2. 使用缓存
   添加环境变量：electron_config_cache="./cache"  
   参考：https://www.electronjs.org/docs/tutorial/installation

#### 核心文件结构

- src
  - common              通用文件
  - data                数据模型
  - ipc                 ipc 通讯封装
  - main                electron 主进程
    - index.ts          入口
    - database/         数据库
    - singletons/       单例
    - menu.ts           菜单
    - protocol.ts       自定义协议
    - windowManager.ts  窗口管理
  - preload             预加载脚本
    - index.ts
  - renderer            渲染进程（react）
    - components        基础组件（不应包含业务，业务组件在 views 中封装）
    - views             多页面/路由
      - project-editor  编辑器页面
        - components    业务组件（处理业务组件，和基础UI组件分离）
      - project-manager 工程管理
        - components
  - store               数据管理（redux/recoil）
- script              python/c++等处理脚本
- webpack
  - config.main.ts - 主进程 webpack 配置
  - config.renderer.ts - 渲染进程 webpack 配置
...
