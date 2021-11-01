import { Configuration } from 'electron-builder'
const buildOptions: Configuration =  {
  productName: "one-theme-editor",
  appId: "com.editor.theme.one",
  copyright: "sunny-20200321",
  extends: null,
  compression: "store",
  asar: false,
  // extraResources: [{ from: "static", to: "app/static" }],
  extraMetadata: { main: "release.main/index.js" },
  files: [
    "release.renderer/**/*", 
    "release.main/**/*", 
    "static/**/*"
  ],
  // mac: {
  //   target: "dmg",
  //   icon: "icons/icon.png"
  // },
  // dmg: {
  //   backgroundColor: "#ffffff",
  //   icon: "icons/icon.png",
  //   iconSize: 80,
  //   title: "ThemeEditor"
  // },
  // win: {
  //   target: "nsis",
  //   // 这个意思是打出来32 bit + 64 bit的包，但是要注意：这样打包出来的安装包体积比较大，所以建议直接打32的安装包。
  //   // arch: ["x64", "ia32"],
  //   icon: "icons/icon.png"
  // },
  // linux: {
  //   target: ["AppImage", "deb"],
  //   icon: "icons/icon.png"
  // },
  directories: {
    app: ".",
    output: "./build",
    buildResources: "./static"
  },
  /**
   * 这个nsis的配置指的是安装过程的配置，其实还是很重要的
   * 如果不配置nsis那么应用程序就会自动的安装在C盘。
   * 没有用户选择的余地，这样肯定是不行的
   */
  nsis: {
    oneClick: false, // 是否一键安装
    allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
    allowToChangeInstallationDirectory: true, // 允许修改安装目录
    menuCategory: true,
    createDesktopShortcut: true, // 创建桌面图标
    createStartMenuShortcut: true, // 创建开始菜单图标
    shortcutName: "" // 图标名称
    // include: "build/script/installer.nsh", // 包含的自定义nsis脚本 这个对于构建需求严格得安装过程相当有用。
    // script: "build/script/installer.nsh", // NSIS脚本的路径，用于自定义安装程序。 默认为build / installer.nsi
  }
};

export default buildOptions
