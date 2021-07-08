### Electron React TypeScript 模板

#### 介绍
技术栈：Electron React Reselect TypeScript Nedb Socket.io
样式使用 CSS in JS 方案： styled-component

#### 关于 Electron@8.5.5 版本
由于 React devtools 和 Redux devtools 在 Electron 8 以上版本不能使用，目前没有找到解决方法，直到 12 问题依旧，故 Electron 版本锁定 8 最后一个版本 8.5.5

#### 关于 webpack@4.x.x 版本
目前 webpack 5 还有不少坑，暂时锁定 webpack 4 版本使用
以下包（或类型）严格按照版本使用，因为其内部会指定 webpack ^5，会导致类型报错甚至无法运行
稳定后升 webpack5
- mini-css-extract-plugin        @1.4.0
- @types/mini-css-extract-plugin @1.4.0 
- postcss-loader                 @4.3.0
- 其他参照 package.json
- 特别注意的在这里补充，不要乱升
- 升的时候选择 fixable，然后删 node_modules 测试

#### 本地 node 版本 >=14.0.0
image-size        >=12
electron-builder  >=14
log-symbols       >=14


#### 安装

```bash
npm install
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
  - main - electron 主进程
    - index.dev.ts 开发环境启动
    - index.ts     生产环境启动
  - renderer - 渲染进程（react）
  - server - 本地服务进程
  - script - 一些python/c++处理脚本
- webpack
  - config.main.ts - 主进程 webpack 配置
  - config.renderer.ts - 渲染进程 webpack 配置
...
